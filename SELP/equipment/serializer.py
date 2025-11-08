from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        #fields = ('id', 'name', 'category', 'condition', 'quantity', 'availability')