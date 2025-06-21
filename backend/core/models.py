from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User model with role
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('professor', 'Professor'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

# Direction (e.g., Faculty or Institute)
class Direction(models.Model):
    name = models.CharField(max_length=100, unique=True)
    semesters_count = models.PositiveIntegerField(default=1)
    credits_per_semester = models.PositiveIntegerField(default=24)  # Max credits per semester

    def __str__(self):
        return self.name

# Semester (linked to a Direction)
class Semester(models.Model):
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE, related_name='semesters')
    number = models.PositiveIntegerField()  # e.g., 1 for Semester 1
    primary_credits = models.PositiveIntegerField(default=0)  # Credits for primary subjects

    class Meta:
        unique_together = ('direction', 'number')

    def __str__(self):
        return f"{self.direction.name} - Semester {self.number}"

# Subject
class Subject(models.Model):
    name = models.CharField(max_length=100)
    credits = models.PositiveIntegerField()
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE, related_name='subjects')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='subjects')
    professor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role': 'professor'})
    is_primary = models.BooleanField(default=False)  # Mandatory for semester?

    class Meta:
        unique_together = ('name', 'direction', 'semester')

    def __str__(self):
        return f"{self.name} ({self.direction.name})"

# Event
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date_time = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'})
    recipients = models.ManyToManyField(Direction, blank=True)  # Optional: Specific directions

    def __str__(self):
        return self.title

# Student Enrollment (tracks students in directions and subjects)
class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    subjects = models.ManyToManyField(Subject, blank=True)  # Chosen subjects

    class Meta:
        unique_together = ('student', 'direction', 'semester')

    def __str__(self):
        return f"{self.student.username} in {self.direction.name}"