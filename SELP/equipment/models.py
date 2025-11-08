from django.db import models

# Create your models here.

class Item(models.Model):
    categories = [
        ('sports', 'Sports Kits'),
        ('lab', 'Lab Equipment'),
        ('cameras', 'Cameras'),
        ('musical', 'Musical Instruments'),
        ('project', 'Project Materials'),
    ]

    condition_types = [
        ('New', 'Brand New'),
        ('Good', 'Not new but good'),
        ('Fair', 'Okay to work with'),
        ('Broken', 'not in working condition'),
    ]

    name = models.CharField(max_length=250)
    category = models.CharField(max_length=100, choices=categories)
    condition = models.CharField(max_length=100, choices=condition_types, default='New')
    quantity = models.IntegerField(default=0)
    availability = models.IntegerField(default=0)
    
    class Meta:        
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'category', 'condition'], 
                name='unique_item_name_category_condition'
            )
        ]

