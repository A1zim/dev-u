from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Direction, Semester, Course, Attendance, Grade, Event, Schedule

# Inline for Semesters under Direction
class SemesterInline(admin.TabularInline):
    model = Semester
    extra = 1
    fields = ('number', 'credits')
    ordering = ('number',)

# Inline for Courses under Semester
class CourseInline(admin.TabularInline):
    model = Course
    extra = 1
    fields = ('name', 'credits', 'is_mandatory', 'professor')
    ordering = ('name',)

# User Admin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('fio', 'username', 'email', 'role', 'direction', 'course', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('fio', 'username', 'email')
    ordering = ('fio',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('fio', 'email', 'role', 'direction', 'course')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'fio', 'email', 'role', 'direction', 'course', 'password1', 'password2'),
        }),
    )

# Direction Admin
@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'semesters')
    search_fields = ('name',)
    ordering = ('name',)
    inlines = [SemesterInline]

# Semester Admin
@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('direction', 'number', 'credits')
    list_filter = ('direction',)
    search_fields = ('direction__name', 'number')
    ordering = ('direction', 'number')
    inlines = [CourseInline]

# Course Admin
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'semester', 'credits', 'is_mandatory', 'professor')
    list_filter = ('semester__direction', 'is_mandatory')
    search_fields = ('name', 'semester__direction__name', 'professor__fio')
    ordering = ('semester', 'name')

# Attendance Admin
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'date', 'status')
    list_filter = ('status', 'date', 'course__semester__direction')
    search_fields = ('student__fio', 'course__name')
    ordering = ('-date',)
    date_hierarchy = 'date'

# Grade Admin
@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'type', 'score')
    list_filter = ('type', 'course__semester__direction')
    search_fields = ('student__fio', 'course__name')
    ordering = ('student', 'course')

# Event Admin
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'recipient_count')
    list_filter = ('date',)
    search_fields = ('title', 'description')
    ordering = ('-date',)
    date_hierarchy = 'date'

    def recipient_count(self, obj):
        return obj.recipients.count()
    recipient_count.short_description = 'Recipients'

# Schedule Admin
@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('course', 'date', 'time', 'topic')
    list_filter = ('course__semester__direction', 'date')
    search_fields = ('course__name', 'topic')
    ordering = ('-date',)
    date_hierarchy = 'date'