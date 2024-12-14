from django.urls import path
from . import views


urlpatterns = [
    path('', views.get_skills, name='get_skills'),
    path('language/', views.create_language, name='create_language'),
    path('language/<int:lang_id>/', views.update_or_delete_language, name='update_or_delete_language'),
    path('technology/', views.create_technology, name='create_technology'),
    path('technology/<int:tech_id>/', views.update_or_delete_technology, name='update_or_delete_technology'),
]
