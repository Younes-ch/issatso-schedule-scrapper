from django.db import models

# Create your models here.
class Group(models.Model):
    name = models.SlugField(max_length=10, primary_key=True)
    schedule_html = models.TextField()
    occupied_classrooms = models.TextField()

    def __str__(self):
        return self.name
