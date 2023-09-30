from django.db import models

# Create your models here.


class Files(models.Model):
    csv = models.FileField(upload_to='files/')

    def __str__(self):
        return self.csv