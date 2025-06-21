from django.contrib import admin
from .models import User, Direction, Semester, Subject, Event, Enrollment

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    list_filter = ('role',)
    search_fields = ('username', 'email')

@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'semesters_count', 'credits_per_semester')
    search_fields = ('name',)

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('direction', 'number', 'primary_credits')
    list_filter = ('direction',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'direction', 'semester', 'professor', 'credits', 'is_primary')
    list_filter = ('direction', 'semester', 'is_primary')
    search_fields = ('name',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date_time', 'created_by')
    list_filter = ('date_time',)
    search_fields = ('title',)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'direction', 'semester')
    list_filter = ('direction', 'semester')
    search_fields = ('student__username',)