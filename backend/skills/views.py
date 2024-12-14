import logging

from django.db import DatabaseError, transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from admin_auth.decorators import access_token_required
from projects.models import (AssociatedFramework, AssociatedLanguage,
                             AssociatedLib, AssociatedOrm, AssociatedTech)

from .models import (Framework, Language, Lib, Orm, Technology,
                     TechnologySection)
from .serializers import (CreateLanguageSerializer, CreateTechnolgySerializer,
                          LanguageSerializer, TechnologySerializer,
                          UpdateLanguageSerializer, UpdateTechnologySerializer)

logger = logging.getLogger("app_logger")


@api_view(["GET"])
def get_skills(request):
    try:
        languages = Language.objects.all()
        serialazed_languages = LanguageSerializer(languages, many=True).data

        technologies = Technology.objects.all()
        serialized_technologies = TechnologySerializer(technologies, many=True).data

        return Response(
            {
                "languages": serialazed_languages,
                "technologies": serialized_technologies,
            },
            status=status.HTTP_200_OK,
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


@api_view(["POST"])
@access_token_required
def create_language(request):
    try:
        serializer = CreateLanguageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            language_data = serializer.validated_data

            new_language = Language.objects.create(name=language_data["name"])

            for orm_name in language_data.get("orms", []):
                Orm.objects.create(name=orm_name, language=new_language)

            for framework_name in language_data.get("frameworks", []):
                Framework.objects.create(name=framework_name, language=new_language)

            for lib_name in language_data.get("libs", []):
                Lib.objects.create(name=lib_name, language=new_language)

            return Response(
                {"language": LanguageSerializer(new_language).data},
                status=status.HTTP_200_OK,
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


@api_view(["PATCH", "DELETE"])
@access_token_required
def update_or_delete_language(request, lang_id):
    if request.method == "PATCH":
        return update_language(request, lang_id=lang_id)
    else:
        return delete_language(request, lang_id=lang_id)


def update_language(request, lang_id):
    try:
        language = Language.objects.get(id=lang_id)

        # validating json data
        serializer = UpdateLanguageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            if serializer.validated_data.get("name"):
                language.name = serializer.validated_data["name"]
                language.save()

            # creating new orms/frameworks/libs
            new_orms = serializer.validated_data.get("new_orms", [])
            for orm_name in new_orms:
                Orm.objects.create(name=orm_name, language=language)

            new_frameworks = serializer.validated_data.get("new_frameworks", [])
            for framework_name in new_frameworks:
                Framework.objects.create(name=framework_name, language=language)

            new_libs = serializer.validated_data.get("new_libs", [])
            for lib_name in new_libs:
                Lib.objects.create(name=lib_name, language=language)

            # updating exsisting orms/frameworks/libs
            old_orms = serializer.validated_data.get("old_orms", [])
            for orm_data in old_orms:
                orm = Orm.objects.get(id=orm_data["id"])
                orm.name = orm_data["name"]
                orm.save()

            old_frameworks = serializer.validated_data.get("old_frameworks", [])
            for framework_data in old_frameworks:
                framework = Framework.objects.get(id=framework_data["id"])
                framework.name = framework_data["name"]
                framework.save()

            old_libs = serializer.validated_data.get("old_libs", [])
            for lib_data in old_libs:
                lib = Lib.objects.get(id=lib_data["id"])
                lib.name = lib_data["name"]
                lib.save()

            # deleting exsisting orms/frameworks/libs
            deleted_orms = serializer.validated_data.get("deleted_orms", [])
            for orm_id in deleted_orms:
                orm = Orm.objects.get(id=orm_id)
                is_referenced = AssociatedOrm.objects.filter(orm=orm).exists()
                if is_referenced:
                    return Response(
                        {
                            "msg": f"Cannot delete the orm {orm.name} because it is associated with other projects."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                orm.delete()

            deleted_frameworks = serializer.validated_data.get("deleted_frameworks", [])
            for framework_id in deleted_frameworks:
                framework = Framework.objects.get(id=framework_id)
                is_referenced = AssociatedFramework.objects.filter(
                    framework=framework
                ).exists()
                if is_referenced:
                    return Response(
                        {
                            "msg": f"Cannot delete the framework {framework.name} because it is associated with other projects."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                framework.delete()

            deleted_libs = serializer.validated_data.get("deleted_libs", [])
            for lib_id in deleted_libs:
                lib = Lib.objects.get(id=lib_id)
                is_referenced = AssociatedLib.objects.filter(lib=lib).exists()
                if is_referenced:
                    return Response(
                        {
                            "msg": f"Cannot delete the library {lib.name} because it is associated with other projects."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                lib.delete()

            return Response(
                {"language": LanguageSerializer(language).data},
                status=status.HTTP_200_OK,
            )
    except Language.DoesNotExist:
        return Response(
            {"msg": "Language not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Orm.DoesNotExist:
        return Response({"msg": "Orm not found."}, status=status.HTTP_400_BAD_REQUEST)
    except Framework.DoesNotExist:
        return Response(
            {"msg": "Framework not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Lib.DoesNotExist:
        return Response(
            {"msg": "Library not found."}, status=status.HTTP_400_BAD_REQUEST
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


def delete_language(request, lang_id):
    try:
        language = Language.objects.get(id=lang_id)

        # cheking for an assiciated project
        is_referenced = AssociatedLanguage.objects.filter(language=language).exists()
        if is_referenced:
            return Response(
                {
                    "msg": "Cannot delete this language because it is associated with other projects."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # deleting the language
        language.delete()
        return Response(
            {"msg": "Language deleted succsuccessfully."}, status=status.HTTP_200_OK
        )
    except Language.DoesNotExist:
        return Response(
            {"msg": "Language not found."}, status=status.HTTP_400_BAD_REQUEST
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


@api_view(["POST"])
@access_token_required
def create_technology(request):
    try:
        serializer = CreateTechnolgySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        # now we have valid data we need to starta trasaction and add our stuff
        with transaction.atomic():
            # we need to start by creating a new technology
            new_technology = Technology.objects.create(
                name=serializer.validated_data["name"]
            )

            # now we loop on each section and we add the stuff into it
            sections = serializer.validated_data["sections"]
            for section in sections:
                TechnologySection.objects.create(
                    technology=new_technology,
                    header=section["header"],
                    content=section["content"],
                )

            return Response(
                {"technology": TechnologySerializer(new_technology).data},
                status=status.HTTP_200_OK,
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


@api_view(["PATCH", "DELETE"])
@access_token_required
def update_or_delete_technology(request, tech_id):
    if request.method == "PATCH":
        return update_technology(request, tech_id=tech_id)
    else:
        return delete_technology(request, tech_id=tech_id)


def update_technology(request, tech_id):
    try:
        technology = Technology.objects.get(id=tech_id)

        serializer = UpdateTechnologySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # we starts by the name
            if serializer.validated_data.get("name"):
                technology.name = serializer.validated_data["name"]
                technology.save()
            # we add the new sections
            new_sections = serializer.validated_data.get("new_sections", [])
            for section in new_sections:
                TechnologySection.objects.create(
                    technology=technology,
                    header=section["header"],
                    content=section["content"],
                )

            # we update the older sections
            old_sections = serializer.validated_data.get("old_sections", [])
            for section in old_sections:
                new_header = section.get("header")
                new_content = section.get("content")
                old_section = TechnologySection.objects.get(id=section["id"])

                if new_header:
                    old_section.header = new_header
                if new_content:
                    old_section.content = new_content
                old_section.save()

            # we delete the older sections but the lenght of all of them should not be 0
            deleted_sections = serializer.validated_data.get("deleted_sections", [])
            total_sections = technology.sections.count()
            if len(deleted_sections) >= total_sections:
                return Response(
                    {"msg": "A technology must have at least one section."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            for section_id in deleted_sections:
                section = TechnologySection.objects.get(id=section_id)
                section.delete()

            return Response(
                {"technology": TechnologySerializer(technology).data},
                status=status.HTTP_200_OK,
            )
    except Technology.DoesNotExist:
        logger.info("Attempt to update a non existent technology with id: %s.", tech_id)
        return Response(
            {"msg": "Technolgy not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except TechnologySection.DoesNotExist:
        logger.info(
            "Attempt to update or delete a non existent technology section on technology with id: %s",
            tech_id,
        )
        return Response(
            {"msg": "Technolgy section not found."}, status=status.HTTP_400_BAD_REQUEST
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


def delete_technology(request, tech_id):
    try:
        technology = Technology.objects.get(id=tech_id)

        is_referenced = AssociatedTech.objects.filter(technology=technology).exists()
        if is_referenced:
            return Response(
                {
                    "msg": "Cannot delete this technology because it is associated with other projects."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        technology.delete()
        return Response(
            {"msg": "Tehcnology deleted successfully."}, status=status.HTTP_200_OK
        )
    except Technology.DoesNotExist:
        logger.info("Attempt to update a non existent technology with id: %s.", tech_id)
        return Response(
            {"msg": "Technolgy not found."}, status=status.HTTP_400_BAD_REQUEST
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
