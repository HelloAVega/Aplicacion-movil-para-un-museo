from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    course = models.CharField(max_length=255, null=True, blank=True)
    avatar_color = models.CharField(max_length=7, default="#2E7D6C")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Image(models.Model):
    filename = models.CharField(max_length=255, unique=True)
    file = models.ImageField(upload_to='uploads/')
    original_name = models.CharField(max_length=255)
    artwork_name = models.CharField(max_length=255)
    artwork_author = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    # IA
    ai_status = models.CharField(max_length=50, default='pending')
    ai_metadata = models.TextField(null=True, blank=True)
    ai_error = models.TextField(null=True, blank=True)
    ai_processed_at = models.DateTimeField(null=True, blank=True)

    rating = models.IntegerField(default=0)
    owner = models.ForeignKey('api.User', related_name='images', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.artwork_name} ({self.id})"
