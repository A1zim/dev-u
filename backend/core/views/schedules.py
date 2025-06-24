from rest_framework import generics
from ..models import Schedule
from ..serializers import ScheduleSerializer
from ..permissions import IsStudent, IsTeacherOrAdmin

class ScheduleListCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsTeacherOrAdmin]

class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsTeacherOrAdmin]

class StudentScheduleListView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Schedule.objects.filter(course__semester__direction=self.request.user.direction)