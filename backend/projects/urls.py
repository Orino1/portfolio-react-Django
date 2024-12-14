from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_or_post_project, name="get_or_post_project"),
    path(
        "<int:project_id>/",
        views.update_or_delete_project,
        name="update_or_delete_project",
    ),
]
