from django.db import models

class Book(models.Model):
    bookTitle = models.CharField(max_length=50)
    release_year = models.IntegerField()

    def __str__(self):
        return f"{self.title} {self.release_year}"