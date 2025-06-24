from rest_framework import serializers
from .models import User, Direction, Semester, Course, Attendance, Grade, Event, Schedule

class UserSerializer(serializers.ModelSerializer):
    direction_name = serializers.CharField(source='direction.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'fio', 'email', 'role', 'direction', 'direction_name', 'course', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            fio=validated_data['fio'],
            role=validated_data.get('role', 'student'),
            direction=validated_data.get('direction'),
            course=validated_data.get('course')
        )
        return user

class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = ['id', 'name', 'semesters']

class SemesterSerializer(serializers.ModelSerializer):
    direction_name = serializers.CharField(source='direction.name', read_only=True)

    class Meta:
        model = Semester
        fields = ['id', 'direction', 'direction_name', 'number', 'credits']

class CourseSerializer(serializers.ModelSerializer):
    professor_name = serializers.CharField(source='professor.fio', read_only=True)
    semester_number = serializers.IntegerField(source='semester.number', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'semester', 'semester_number', 'name', 'credits', 'is_mandatory', 'professor', 'professor_name']

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.fio', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_name', 'course', 'course_name', 'date', 'status']

class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.fio', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_name', 'course', 'course_name', 'type', 'score']

class EventSerializer(serializers.ModelSerializer):
    recipient_names = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'recipients', 'recipient_names']

    def get_recipient_names(self, obj):
        return [user.fio for user in obj.recipients.all()]

class ScheduleSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    professor_name = serializers.CharField(source='course.professor.fio', read_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'course', 'course_name', 'date', 'time', 'topic', 'professor_name']