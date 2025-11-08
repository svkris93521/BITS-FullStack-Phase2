from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello_users),
    path('login/', views.user_login_view),
    path('logout/', views.user_login_view),
]