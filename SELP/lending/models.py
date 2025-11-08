from django.db import models
from django.conf import settings
from users.models import User
from equipment.models import Item
from django.core.validators import MinValueValidator

# Create your models here.
class LendingRequest(models.Model):
    status_type = [
        ('new', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('issued', 'Issued'),
        ('returned', 'Returned'),
    ]

    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, related_name='requested_lending')
    item = models.ForeignKey(Item, on_delete=models.DO_NOTHING, related_name='requested_item')
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    from_date = models.DateField()
    to_date = models.DateField()
    status = models.CharField(max_length=100, choices=status_type, default='new')
    approver = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, related_name='request_approver')
    requested_date = models.DateField()
    issued_date = models.DateField(null=True)
    returned_date = models.DateField(null=True)
    purpose = models.CharField(max_length=1000, default='new')
