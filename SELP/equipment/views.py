from django.shortcuts import render
from django.http import HttpResponse
from django.db import transaction, DatabaseError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Item
from .serializer import ItemSerializer

# Create your views here.
def hello_equipment(request):
    return HttpResponse("Thanks for visiting <b>EQUIPMENT</b> app!!")

@api_view(['GET'])
def get_items(request):
    items = Item.objects.all()
    serializedData = ItemSerializer(items, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_item(request):
    req_data = request.data
    serializer = ItemSerializer(data=req_data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                instance = serializer.save()
                
                if not instance.pk:
                    raise DatabaseError("PK not generated after save.") 

                # print(f"SUCCESS: Item inserted with ID: {instance.pk}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except DatabaseError as e:
            return Response({"detail": f"Database insertion failed: {e}"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_item(request, pk):
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return Response(status = status.HTTP_404_NOT_FOUND)
    
    item.delete()
    return Response(status = status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def update_item(request, pk):
    req_data = request.data
    try:
        item = Item.objects.get(pk=pk)
    except Item.DoesNotExist:
        return Response(status = status.HTTP_404_NOT_FOUND)
    
    serializer = ItemSerializer(item, data=req_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)