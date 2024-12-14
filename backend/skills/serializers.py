from rest_framework import serializers

from .models import (Framework, Language, Lib, Orm, Technology,
                     TechnologySection)


class OrmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orm
        fields = ["id", "name"]


class LibSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lib
        fields = ["id", "name"]


class FrameworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Framework
        fields = ["id", "name"]


class LanguageSerializer(serializers.ModelSerializer):
    orms = OrmSerializer(many=True)
    frameworks = FrameworkSerializer(many=True)
    libs = LibSerializer(many=True)

    class Meta:
        model = Language
        fields = ["id", "name", "frameworks", "orms", "libs"]


class TechnologySectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TechnologySection
        fields = ["id", "header", "content"]


class TechnologySerializer(serializers.ModelSerializer):
    sections = TechnologySectionSerializer(many=True)

    class Meta:
        model = Technology
        fields = ["id", "name", "sections"]


class CreateLanguageSerializer(serializers.Serializer):
    name = serializers.CharField(
        min_length=1, max_length=50, trim_whitespace=True, required=True
    )
    orms = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=50),
        required=True,
        allow_empty=True,
    )
    frameworks = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=50),
        required=True,
        allow_empty=True,
    )
    libs = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=50),
        required=True,
        allow_empty=True,
    )


class CreateTechnologySectionSerializer(serializers.Serializer):
    header = serializers.CharField(
        min_length=1, max_length=50, required=True, trim_whitespace=True
    )
    content = serializers.CharField(min_length=1, required=True, trim_whitespace=True)


class CreateTechnolgySerializer(serializers.Serializer):
    name = serializers.CharField(
        min_length=1, max_length=50, trim_whitespace=True, required=True
    )
    sections = serializers.ListField(
        child=CreateTechnologySectionSerializer(), required=True, allow_empty=False
    )


class UpdateLanguageChildren(serializers.Serializer):
    id = serializers.IntegerField(min_value=1, required=True)
    name = serializers.CharField(
        min_length=1, max_length=50, required=True, trim_whitespace=True
    )


class UpdateLanguageSerializer(serializers.Serializer):
    name = serializers.CharField(
        min_length=1, max_length=50, trim_whitespace=True, required=False
    )
    new_orms = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=50, trim_whitespace=True),
        allow_empty=True,
        required=False,
    )
    new_frameworks = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=50, trim_whitespace=True),
        allow_empty=True,
        required=False,
    )
    new_libs = serializers.ListField(
        child=serializers.CharField(min_length=1, max_length=50, trim_whitespace=True),
        allow_empty=True,
        required=False,
    )
    old_orms = serializers.ListField(
        child=UpdateLanguageChildren(), allow_empty=True, required=False
    )
    old_frameworks = serializers.ListField(
        child=UpdateLanguageChildren(), allow_empty=True, required=False
    )
    old_libs = serializers.ListField(
        child=UpdateLanguageChildren(), allow_empty=True, required=False
    )
    deleted_orms = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=True, required=False
    )
    deleted_frameworks = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=True, required=False
    )
    deleted_libs = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=True, required=False
    )


class UpdateTechnologySectionSerializer(serializers.Serializer):
    id = serializers.IntegerField(min_value=1, required=True)
    header = serializers.CharField(
        min_length=1, max_length=50, required=False, trim_whitespace=True
    )
    content = serializers.CharField(min_length=1, required=False, trim_whitespace=True)


class UpdateTechnologySerializer(serializers.Serializer):
    name = serializers.CharField(
        min_length=1, max_length=50, trim_whitespace=True, required=False
    )
    new_sections = serializers.ListField(
        child=CreateTechnologySectionSerializer(), allow_empty=True, required=False
    )
    old_sections = serializers.ListField(
        child=UpdateTechnologySectionSerializer(), required=False
    )
    deleted_sections = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=True, required=False
    )
