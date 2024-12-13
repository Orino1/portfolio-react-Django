from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('refresh/', views.refresh_access_token, name='refresh'),
    path('status/', views.admin_status, name='status'),
    path('password/', views.update_password, name='update_password'),
]