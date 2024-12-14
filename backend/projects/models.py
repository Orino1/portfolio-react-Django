from django.db import models
from skills.models import Framework, Language, Lib, Orm, Technology


class Project(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True)
    description = models.TextField(null=False)
    problem_statement = models.TextField(null=False)
    solution = models.TextField(null=False)

    def __str__(self):
        return f"Project {self.name} with id {self.id}."


class ProjectVariant(models.Model):
    deployed_link = models.CharField(max_length=255)
    repo_link = models.CharField(max_length=255, null=False)

    project = models.ForeignKey(
        Project, null=False, related_name="variants", on_delete=models.CASCADE
    )

    def __str__(self):
        return f"Project Variant for project {self.project.name} with id {self.id}."


class AssociatedTech(models.Model):
    project_variant = models.ForeignKey(
        ProjectVariant,
        null=False,
        related_name="technologies",
        on_delete=models.CASCADE,
    )
    technology = models.ForeignKey(Technology, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"AssociatedTech: {self.technology.name} for Project Variant {self.project_variant.id}."


class AssociatedLanguage(models.Model):
    project_variant = models.ForeignKey(
        ProjectVariant, null=False, related_name="languages", on_delete=models.CASCADE
    )
    language = models.ForeignKey(Language, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"AssociatedLanguage: {self.language.name} for Project Variant {self.project_variant.id}."


class AssociatedOrm(models.Model):
    associated_lang = models.ForeignKey(
        AssociatedLanguage, null=False, related_name="orms", on_delete=models.CASCADE
    )
    orm = models.ForeignKey(Orm, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"AssociatedOrm: {self.orm.name} for AssociatedLanguage {self.associated_lang.id}."


class AssociatedFramework(models.Model):
    associated_lang = models.ForeignKey(
        AssociatedLanguage,
        null=False,
        related_name="frameworks",
        on_delete=models.CASCADE,
    )
    framework = models.ForeignKey(Framework, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"AssociatedFramework: {self.framework.name} for AssociatedLanguage {self.associated_lang.id}."


class AssociatedLib(models.Model):
    associated_lang = models.ForeignKey(
        AssociatedLanguage, null=False, related_name="libs", on_delete=models.CASCADE
    )
    lib = models.ForeignKey(Lib, null=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"AssociatedLib: {self.lib.name} for AssociatedLanguage {self.associated_lang.id}."
