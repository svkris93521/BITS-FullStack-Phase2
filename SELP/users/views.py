from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from .serializer import UserSerializer


import base64
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt 
from rest_framework.authentication import BasicAuthentication

# Create your views here.
def hello_users(request):
    return HttpResponse("Thanks for visiting <b>USERS</b> App!!")

'''@api_view(['POST'])
@permission_classes([AllowAny]) 
@csrf_exempt 
def test_users(request):
    return Response({"test":"Thanks for visiting App!!"}) '''


def get_decoded_credentials(request):
    auth_header = request.headers.get('Authorization')
        
    if not auth_header or not auth_header.startswith('Basic '):
        return None, None

    base64_credentials = auth_header.split(' ')[1]
    
    try:
        decoded_credentials = base64.b64decode(base64_credentials).decode('utf-8')
        
        # The decoded string is typically 'username:password'
        if ':' in decoded_credentials:
            username, password = decoded_credentials.split(':', 1)
            username = username.strip()
            password = password.strip()
            return username, password
            
    except Exception as e:
        return None, None
    
    return None, None


@api_view(['POST'])
@permission_classes([AllowAny]) 
@csrf_exempt 
def user_login_view(request):
    username, password = get_decoded_credentials(request)
    
    if not username or not password:
        return Response(
            {'detail': 'Basic Authentication credentials missing or invalid.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user) 
        serializedData = UserSerializer(user, many=False).data
        #return Response(serializedData)
        # Determine user role
        user_type = 'student'
        if user.is_superuser:
            user_type = 'admin'
        elif user.is_staff:
            user_type = 'staff'
        return Response({'user_type': user_type, 'perms': serializedData}, status=status.HTTP_200_OK)
    else:
        return Response(
            {'detail': 'Invalid username or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def user_logout_view(request):
    logout(request)

    return Response(
        {'detail': 'Successfully logged out.'}, 
        status=status.HTTP_200_OK
    )