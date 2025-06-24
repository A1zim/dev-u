from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    fio = models.CharField(max_length=255, verbose_name="Full Name")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    email = models.EmailField(unique=True)
    direction = models.ForeignKey('Direction', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    course = models.PositiveIntegerField(null=True, blank=True, verbose_name="Course Year")

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.fio

class Direction(models.Model):
    name = models.CharField(max_length=100, unique=True)
    semesters = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Direction"
        verbose_name_plural = "Directions"

    def __str__(self):
        return self.name

class Semester(models.Model):
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE, related_name='semester_set')  # Changed related_name
    number = models.PositiveIntegerField()
    credits = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Semester"
        verbose_name_plural = "Semesters"
        unique_together = ('direction', 'number')

    def __str__(self):
        return f"Semester {self.number} - {self.direction.name}"

class Course(models.Model):
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=100)
    credits = models.PositiveIntegerField()
    is_mandatory = models.BooleanField(default=True)
    professor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='taught_courses', limit_choices_to={'role': 'teacher'})

    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"

    def __str__(self):
        return self.name

class Attendance(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances', limit_choices_to={'role': 'student'})
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Attendance"
        verbose_name_plural = "Attendances"
        unique_together = ('student', 'course', 'date')

    def __str__(self):
        return f"{self.student.fio} - {self.course.name} - {self.date}"

class Grade(models.Model):
    TYPE_CHOICES = (
        ('module1', 'Module 1'),
        ('module2', 'Module 2'),
        ('final', 'Final'),
        ('homework', 'Homework'),
        ('lab', 'Lab'),
    )
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grades', limit_choices_to={'role': 'student'})
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='grades')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    score = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Grade"
        verbose_name_plural = "Grades"
        unique_together = ('student', 'course', 'type')

    def __str__(self):
        return f"{self.student.fio} - {self.course.name} - {self.type}"

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    recipients = models.ManyToManyField(User, related_name='events')

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return self.title

class Schedule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='schedules')
    date = models.DateField()
    time = models.TimeField()
    topic = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Schedule"
        verbose_name_plural = "Schedules"

    def __str__(self):
        return f"{self.course.name} - {self.date} {self.time}"