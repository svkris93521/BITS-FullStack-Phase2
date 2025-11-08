from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction, DatabaseError

from equipment.models import Item
from .models import LendingRequest 
from .serializer import ItemAvailabilitySerializer 
from .serializer import LendingRequestDetailedSerializer


# Create your views here.
def hello_lending(request):
    return HttpResponse("Thanks for visiting <b>LENDING</b> app!!")

@api_view(['GET'])
def get_transactions(request):

    queryset = Item.objects.all()
    category = request.query_params.get('category')
    if category:
        queryset = queryset.filter(category=category)
    
    from_date = request.query_params.get('from_date')
    to_date = request.query_params.get('to_date')

    active_statuses = ['approved', 'issued'] 

    context = {
        'from_date': from_date,
        'to_date': to_date,
        'active_statuses': active_statuses 
    }

    serialized_data = ItemAvailabilitySerializer(queryset, many=True, context=context).data
    return Response(serialized_data)


@api_view(['GET'])
def get_user_transactions(request):
    requests = LendingRequest.objects.all()
    requester_id = request.query_params.get('requester', None)

    if requester_id:
        requests = requests.filter(requester=requester_id)
        
    serializedData = LendingRequestDetailedSerializer(requests, many=True).data
    return Response(serializedData)


@api_view(['GET'])
def get_transactions_forapproval(request):
    look_status = ['new', 'approved', 'issued']
    requests = LendingRequest.objects.all().filter(status__in=look_status)        
    serializedData = LendingRequestDetailedSerializer(requests, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_lending(request):
    req_data = request.data
    serializer = LendingRequestDetailedSerializer(data=req_data)
    # print("DATA=" + serializ.)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                instance = serializer.save()
                
                # Double-check PK assignment
                if not instance.pk:
                    # This check catches a very rare ORM-level failure
                    raise DatabaseError("PK not generated after save.") 

                # print(f"SUCCESS: Item inserted with ID: {instance.pk}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except DatabaseError as e:
            return Response({"detail": f"Database insertion failed: {e}"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def update_lending(request, pk):
    req_data = request.data
    try:
        lending = LendingRequest.objects.get(pk=pk)
    except LendingRequest.DoesNotExist:
        return Response(status = status.HTTP_404_NOT_FOUND)
    
    serializer = LendingRequestDetailedSerializer(lending, data=req_data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

