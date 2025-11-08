from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello_equipment),
    path('items', views.get_items),
    path('items/create', views.create_item),
    path('items/<int:pk>', views.delete_item, name="delete_item"),
    path('items/edit/<int:pk>', views.update_item, name="update_item"),  
]