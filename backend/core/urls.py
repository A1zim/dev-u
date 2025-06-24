from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.views.attendance import AttendanceListCreateView, AttendanceDetailView
from core.views.auth import CreateUserView, MeView
from core.views.courses import CourseListCreateView, CourseDetailView
from core.views.directions import DirectionListCreateView, DirectionDetailView
from core.views.events import EventListCreateView, EventDetailView
from core.views.grades import GradeListCreateView, GradeDetailView
from core.views.schedules import ScheduleListCreateView, ScheduleDetailView, StudentScheduleListView
from core.views.semesters import SemesterListCreateView, SemesterDetailView
from core.views.students import StudentListCreateView, StudentDetailView

urlpatterns = [
    # Authentication
    path('register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),

    # Directions
    path('directions/', DirectionListCreateView.as_view(), name='direction-list'),
    path('directions/<int:pk>/', DirectionDetailView.as_view(), name='direction-detail'),

    # Semesters
    path('semesters/', SemesterListCreateView.as_view(), name='semester-list'),
    path('semesters/<int:pk>/', SemesterDetailView.as_view(), name='semester-detail'),

    # Students
    path('students/', StudentListCreateView.as_view(), name='student-list'),
    path('students/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),

    # Courses
    path('courses/', CourseListCreateView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Attendance
    path('attendance/', AttendanceListCreateView.as_view(), name='attendance-list'),
    path('attendance/<int:pk>/', AttendanceDetailView.as_view(), name='attendance-detail'),

    # Grades
    path('grades/', GradeListCreateView.as_view(), name='grade-list'),
    path('grades/<int:pk>/', GradeDetailView.as_view(), name='grade-detail'),

    # Schedules
    path('schedules/', ScheduleListCreateView.as_view(), name='schedule-list'),
    path('schedules/<int:pk>/', ScheduleDetailView.as_view(), name='schedule-detail'),
    path('student/schedules/', StudentScheduleListView.as_view(), name='student-schedule-list'),

    # Events
    path('events/', EventListCreateView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
]