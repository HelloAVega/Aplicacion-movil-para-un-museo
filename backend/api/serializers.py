from rest_framework import serializers
from .models import User, Image
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'age', 'course')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'age', 'course', 'avatar_color')


class ImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ('id', 'original_name', 'artwork_name', 'artwork_author', 'description', 'rating', 'ai_status', 'ai_metadata', 'ai_error', 'owner', 'created_at', 'updated_at', 'url', 'file')
        read_only_fields = ('owner', 'created_at', 'updated_at')

    def get_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['owner'] = user
        # derive filename
        validated_data['filename'] = validated_data.get('file').name
        return super().create(validated_data)
