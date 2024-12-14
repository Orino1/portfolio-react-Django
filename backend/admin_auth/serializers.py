from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=1, max_length=28, trim_whitespace=True, required=True)
    password = serializers.CharField(min_length=1, max_length=28, trim_whitespace=True, required=True)


class PassSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=1, max_length=28, trim_whitespace=True, required=True)
