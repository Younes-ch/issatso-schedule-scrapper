from django.db import models

# Create your models here.
class Group(models.Model):
    name = models.CharField(max_length=20, primary_key=True)
    timetable_html = models.TextField()
    remedial_html = models.TextField(null=True)
    occupied_classrooms = models.TextField()

    def __str__(self):
        return self.name
