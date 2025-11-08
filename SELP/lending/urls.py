from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello_lending),
    path('items/available/', views.get_transactions),
    path('create', views.create_lending),
    path('requests/', views.get_user_transactions),
    path('staff/', views.get_transactions_forapproval),
    path('update/<int:pk>', views.update_lending, name="update_lending"),  
]