from django.db import models

# Create your models here.

class Language(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)

    def __str__(self):
        return f"Language: {self.name} (ID: {self.id})"


class Orm(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    language = models.ForeignKey(Language, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"ORM: {self.name} (Language: {self.language.name}, ID: {self.id})"


class Framework(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    language = models.ForeignKey(Language, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"Framework: {self.name} (Language: {self.language.name}, ID: {self.id})"


class Lib(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    language = models.ForeignKey(Language, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"Library: {self.name} (Language: {self.language.name}, ID: {self.id})"


class Technology(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)

    def __str__(self):
        return f"Technology: {self.name} (ID: {self.id})"


class TechnologySection(models.Model):
    header = models.CharField(max_length=255, null=False)
    content = models.TextField(null=False)

    technology = models.ForeignKey(Technology, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"Section: {self.header} (Technology: {self.technology.name}, ID: {self.id})"
