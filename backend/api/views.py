from rest_framework import generics, viewsets, permissions
from .models import User, Image
from .serializers import RegisterSerializer, UserSerializer, ImageSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all().order_by('-created_at')
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        queryset = super().get_queryset()
        owner = self.request.query_params.get('owner')
        status = self.request.query_params.get('ai_status')
        if owner is not None:
            queryset = queryset.filter(owner__id=owner)
        if status is not None:
            queryset = queryset.filter(ai_status=status)
        return queryset

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        qs = self.get_queryset().filter(owner=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True, context={'request': request})
        return Response(serializer.data)
