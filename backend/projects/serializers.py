from rest_framework import serializers
from skills.models import Framework, Language, Lib, Orm, Technology
from skills.serializers import (FrameworkSerializer, LibSerializer,
                                OrmSerializer, TechnologySerializer)

from .models import (AssociatedFramework, AssociatedLanguage, AssociatedLib,
                     AssociatedOrm, AssociatedTech, Project, ProjectVariant)


class AssociatedFrameworkSerializer(serializers.ModelSerializer):
    framework = FrameworkSerializer()

    class Meta:
        model = AssociatedFramework
        fields = ["id", "framework"]


class AssociatedOrmSerializer(serializers.ModelSerializer):
    orm = OrmSerializer()

    class Meta:
        model = AssociatedOrm
        fields = ["id", "orm"]


class AssociatedLibSerializer(serializers.ModelSerializer):
    lib = LibSerializer()

    class Meta:
        model = AssociatedLib
        fields = ["id", "lib"]


class NewLangaugeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Language
        fields = ["id", "name"]


class AssociatedLanguageSerializer(serializers.ModelSerializer):
    language = NewLangaugeSerializer()
    frameworks = AssociatedFrameworkSerializer(many=True)
    orms = AssociatedOrmSerializer(many=True)
    libs = AssociatedLibSerializer(many=True)

    class Meta:
        model = AssociatedLanguage
        fields = ["id", "language", "frameworks", "orms", "libs"]


class AssociatedTechSerializer(serializers.ModelSerializer):
    technology = TechnologySerializer()

    class Meta:
        model = AssociatedTech
        fields = ["id", "technology"]


class ProjectVariantSerializer(serializers.ModelSerializer):
    technologies = AssociatedTechSerializer(many=True)
    languages = AssociatedLanguageSerializer(many=True)

    class Meta:
        model = ProjectVariant
        fields = ["id", "deployed_link", "repo_link", "technologies", "languages"]


class ProjectSerializer(serializers.ModelSerializer):
    variants = ProjectVariantSerializer(many=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "problem_statement",
            "solution",
            "variants",
        ]


# Serializers


class CreateAssociatedLanguageSerializer(serializers.Serializer):
    id = serializers.IntegerField(min_value=1, required=True)
    orms = serializers.ListField(
        child=serializers.IntegerField(min_value=1), required=False
    )
    frameworks = serializers.ListField(
        child=serializers.IntegerField(min_value=1), required=False
    )
    libs = serializers.ListField(
        child=serializers.IntegerField(min_value=1), required=False
    )


class CreateProjectVariantSerializer(serializers.Serializer):
    deployed_link = serializers.CharField(
        max_length=255, required=False, trim_whitespace=True
    )
    repo_link = serializers.CharField(
        max_length=255, required=True, trim_whitespace=True
    )
    languages = serializers.ListSerializer(
        child=CreateAssociatedLanguageSerializer(), required=True, allow_empty=False
    )
    technologies = serializers.ListField(
        child=serializers.IntegerField(min_value=1), required=False, allow_empty=True
    )


class CreateProjectSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50, required=True, trim_whitespace=True)
    description = serializers.CharField(required=True, trim_whitespace=True)
    problem_statement = serializers.CharField(required=True, trim_whitespace=True)
    solution = serializers.CharField(required=True, trim_whitespace=True)
    variants = serializers.ListSerializer(
        child=CreateProjectVariantSerializer(), required=True, allow_empty=False
    )
