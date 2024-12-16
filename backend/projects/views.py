import logging

from admin_auth.decorators import access_token_required
from django.db import DatabaseError, transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from skills.models import Framework, Language, Lib, Orm, Technology

from .models import (AssociatedFramework, AssociatedLanguage, AssociatedLib,
                     AssociatedOrm, AssociatedTech, Project, ProjectVariant)
from .serializers import CreateProjectSerializer, ProjectSerializer

logger = logging.getLogger("app_logger")


# get all prjects
@api_view(["GET", "POST"])
def get_or_post_project(request):
    if request.method == "POST":
        return create_project(request)
    else:
        return get_projects(request)


def get_projects(request):
    try:
        projects = Project.objects.all()
        projects_data = ProjectSerializer(projects, many=True).data

        return Response({"projects": projects_data}, status=status.HTTP_200_OK)
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


# create a project

@access_token_required
def create_project(request):
    try:
        serializer = CreateProjectSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            data = serializer.validated_data

            new_project = Project.objects.create(
                name=data["name"],
                description=data["description"],
                problem_statement=data["problem_statement"],
                solution=data["solution"],
            )

            for variant_data in data["variants"]:
                new_project_variant = ProjectVariant.objects.create(
                    deployed_link=variant_data.get("deployed_link"),
                    repo_link=variant_data["repo_link"],
                    project=new_project,
                )

                technologies_data = variant_data["technologies"]
                for technology_id in technologies_data:
                    technology = Technology.objects.get(id=technology_id)
                    AssociatedTech.objects.create(
                        project_variant=new_project_variant, technology=technology
                    ).save()

                languages_data = variant_data["languages"]
                for language_data in languages_data:
                    language = Language.objects.get(id=language_data["id"])

                    new_associated_lang = AssociatedLanguage.objects.create(
                        project_variant=new_project_variant, language=language
                    )

                    orms_data = language_data.get("orms", [])
                    for id in orms_data:
                        orm = Orm.objects.get(id=id)
                        AssociatedOrm(
                            associated_lang=new_associated_lang, orm=orm
                        ).save()

                    frameworks_data = language_data.get("frameworks", [])
                    for id in frameworks_data:
                        framework = Framework.objects.get(id=id)
                        AssociatedFramework(
                            associated_lang=new_associated_lang, framework=framework
                        ).save()

                    libs_data = language_data.get("libs", [])
                    for id in libs_data:
                        lib = Lib.objects.get(id=id)
                        AssociatedLib(
                            associated_lang=new_associated_lang, lib=lib
                        ).save()

            return Response(
                {"project": ProjectSerializer(new_project).data},
                status=status.HTTP_200_OK,
            )
    except Language.DoesNotExist:
        logger.error("A language was not found while creating a project.")
        return Response(
            {"msg": "A language was not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Technology.DoesNotExist:
        logger.error("A technology was not found while creating a project.")
        return Response(
            {"msg": "A technology was not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Orm.DoesNotExist:
        logger.error("An ORM was not found while creating a project.")
        return Response(
            {"msg": "An ORM was not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Framework.DoesNotExist:
        logger.error("A Framework was not found while creating a project.")
        return Response(
            {"msg": "A Framework was not found."}, status=status.HTTP_400_BAD_REQUEST
        )
    except Lib.DoesNotExist:
        logger.error("A library was not found while creating a project.")
        return Response(
            {"msg": "A library was not found."}, status=status.HTTP_400_BAD_REQUEST
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


# update a project
# todo: will be completed after completing teh front end fully


# delete a project
def delete_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)

        project.delete()
        return Response(
            {"msg": "Project deleted successfully."}, status=status.HTTP_200_OK
        )
    except Project.DoesNotExist:
        logger.error("Project with id %s not found.", project_id)
        return Response(
            {"msg": f"Project with id {project_id} not found."},
            status=status.HTTP_400_BAD_REQUEST,
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


@access_token_required
@api_view(["DELETE", "PATCH"])
def update_or_delete_project(request, project_id):
    if request.method == "PATCH":
        pass
    else:
        return delete_project(request, project_id=project_id)
