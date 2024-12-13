from functools import wraps

from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken


def access_token_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        access_token = request.COOKIES.get("access")
        if not access_token:
            return Response({"msg": "No access token provided"}, status=401)

        try:
            AccessToken(access_token)
        except Exception:
            return Response({"msg": "Invalid access token"}, status=401)

        return view_func(request, *args, **kwargs)

    return wrapped_view


def refresh_token_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"msg": "No refresh token provided"}, status=401)
        try:
            RefreshToken(refresh_token)
        except Exception:
            return Response({"msg": "Invalid refresh token"}, status=401)
        return view_func(request, *args, **kwargs)

    return wrapped_view
