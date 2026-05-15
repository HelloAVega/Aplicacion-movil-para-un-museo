from django.contrib import admin
from .models import User, Image

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username')

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'artwork_name', 'owner', 'ai_status', 'created_at')
