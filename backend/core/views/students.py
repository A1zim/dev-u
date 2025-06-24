from rest_framework import generics
from ..models import User
from ..serializers import UserSerializer
from ..permissions import IsAdmin

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.filter(role='student')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(role='student')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]