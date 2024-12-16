import logging
import os
from django.contrib.auth.hashers import check_password, make_password
from django.db import DatabaseError
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from admin_auth.decorators import access_token_required, refresh_token_required
from admin_auth.serializers import LoginSerializer, PassSerializer

from .models import Admin

logger = logging.getLogger("app_logger")


@api_view(["GET"])
@access_token_required
def admin_status(request):
    return Response({"msg": "Admin is logged in."}, status=status.HTTP_200_OK)


@api_view(["POST"])
def login(request):
    try:
        data = request.data
        serializer = LoginSerializer(data=data)
        if not serializer.is_valid():
            logger.warning("unsuccessful loggin attempt using invalid data")
            return Response(
                {"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        admin = Admin.objects.get(username=data["username"])

        if not check_password(data["password"], admin.password):
            logger.warning(
                "unsuccessful loggin attempt by username %s and password %s",
                data["username"],
                data["password"],
            )
            return Response(
                {"msg": "Password incorrect."}, status=status.HTTP_400_BAD_REQUEST
            )

        refresh = RefreshToken.for_user(admin)
        access = AccessToken.for_user(admin)

        response = Response({"msg": "Login successful."}, status=status.HTTP_200_OK)
        response.set_cookie(
            "refresh",
            str(refresh),
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "").lower() == "true",
            samesite=False,
            max_age=60 * 60 * 24 * 7,
            expires=60 * 60 * 24 * 7,
        )
        response.set_cookie(
            "access",
            str(access),
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "").lower() == "true",
            samesite=False,
            max_age=5 * 60,
            expires=5 * 60,
        )

        return response
    except Admin.DoesNotExist:
        logger.warning(
            "unsuccessful loggin attempt by username %s and password %s",
            data["username"],
            data["password"],
        )
        return Response({"msg": "Admin not found."}, status=status.HTTP_400_BAD_REQUEST)
    except DatabaseError as e:
        logger.error("Database error occurred: %s", e)
        return Response(
            {"msg": "An error occurred in the Database."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        logger.error("Unexpected error occurred: %s", e)
        return Response(
            {"msg": "An unexpected error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@refresh_token_required
def logout(request):
    response = Response({"msg": "Logged out successfully."}, status=status.HTTP_200_OK)

    response.set_cookie(
        "refresh",
        "",
        httponly=True,
        secure=os.getenv("COOKIE_SECURE", "").lower() == "true",
        samesite=False,
        max_age=60 * 60 * 24 * 7,
        expires=60 * 60 * 24 * 7,
    )
    response.set_cookie(
        "access",
        "",
        httponly=True,
        secure=os.getenv("COOKIE_SECURE", "").lower() == "true",
        samesite=False,
        max_age=5 * 60,
        expires=5 * 60,
    )

    return response


@api_view(["GET"])
@refresh_token_required
def refresh_access_token(request):
    try:
        refresh_token = request.COOKIES.get("refresh")

        refresh = RefreshToken(refresh_token)
        admin_id = refresh["user_id"]
        admin = Admin.objects.get(id=admin_id)

        new_access_token = AccessToken.for_user(admin)
        response = Response(
            {"msg": "Access token refreshed successfully."}, status=status.HTTP_200_OK
        )
        response.set_cookie(
            "access",
            str(new_access_token),
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "").lower() == "true",
            samesite=False,
            max_age=5 * 60,
            expires=5 * 60,
        )

        return response
    except DatabaseError as e:
        logger.error("Database error occurred: %s", e)
        return Response(
            {"msg": "An error occurred in the Database."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        logger.error("Unexpected error occurred: %s", e)
        return Response(
            {"msg": f"An unexpected error occurred. {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["PATCH"])
@access_token_required
def update_password(request):
    try:
        data = request.data
        serializer = PassSerializer(data=data)

        if not serializer.is_valid():
            logger.warning("password change attempt using invalid data.")
            return Response(
                {"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        refresh_token = request.COOKIES.get("refresh")
        decoded_token = RefreshToken(refresh_token)

        admin_id = decoded_token["user_id"]
        admin = Admin.objects.get(id=admin_id)

        admin.password = make_password(data["password"])
        admin.save()

        return Response(
            {"msg": "Password updated successfully."}, status=status.HTTP_200_OK
        )
    except DatabaseError as e:
        logger.error("Database error occurred: %s", e)
        return Response(
            {"msg": "An error occurred in the Database."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    except Exception as e:
        logger.error("Unexpected error occurred: %s", e)
        return Response(
            {"msg": "An unexpected error occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
