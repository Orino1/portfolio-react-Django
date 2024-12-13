from django.db import models

# Create your models here.


class Admin(models.Model):
    username = models.CharField(max_length=28, null=False)
    password = models.CharField(max_length=255, null=False)

    def __str__(self):
        return f" admin with username {self.username} and id {self.id}."

    # we named the table so we can easlly make a file to create an initial admin
    class Meta:
        db_table = "admin"
