from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    """
    Extends the default Django User model to include a 'role' for 
    role-based access control (RBAC).
    
    Fields inherited from AbstractUser (and fulfilling project requirements):
    - id (Primary Key)
    - username (unique)
    - password (encrypted)
    - first_name
    - last_name
    - is_active
    """
    
    # Define the choices for the user's role
    ROLE_TYPE = [
        ('student', 'Student User'),
        ('staff', 'Staff User'),
        ('admin', 'Administrator User'),
    ]    

    role = models.CharField(max_length=50, choices=ROLE_TYPE, default='student')
    