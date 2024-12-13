from django.core.management.base import BaseCommand
from admin_auth.models import Admin
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Creates an inital admin with the username "root" and password "root"'
    
    def handle(self, *args, **kwargs):
        admin = Admin(username="root", password=make_password("root"))
        admin.save()
        self.stdout.write(self.style.SUCCESS("Admin 'root' created successfully"))
