from rest_framework import generics
from .models import Direction
from .serializers import DirectionSerializer
from rest_framework.permissions import IsAdminUser

class DirectionListCreateView(generics.ListCreateAPIView):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAdminUser]  # Only admins can access

    def perform_create(self, serializer):
        serializer.save()