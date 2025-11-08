from rest_framework import serializers
from equipment.models import Item
from users.models import User 
from .models import LendingRequest
from datetime import date 
from django.db.models import Sum, Q

class RequesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class RequestedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'condition']
        
# --- Main Lending Serializer ---
class LendingRequestDetailedSerializer(serializers.ModelSerializer):

    #requester = RequesterSerializer(read_only=True)
    #item = RequestedItemSerializer(read_only=True)
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all()
    )

    item_name = serializers.ReadOnlyField(source='item.name')
    item_category = serializers.ReadOnlyField(source='item.category')
    item_condition = serializers.ReadOnlyField(source='item.condition')

    requester = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all()
    )

    requester_name = serializers.ReadOnlyField(source='requester.username')

    approver_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='approver', # Map input to the actual ForeignKey model field
        required=False,
        allow_null=True,
    )
    
    class Meta:
        model = LendingRequest
        fields = [
            'id', 
            'requester', 
            'requester_name',
            'item', 
            'item_name',
            'item_category',
            'item_condition',
            'quantity', 
            'from_date', 
            'to_date', 
            'status', 
            'requested_date',
            'purpose', 
            'approver_id',
            'issued_date',
            'returned_date'
        ]

# --- Item Availability Serializer ---
class ItemAvailabilitySerializer(serializers.ModelSerializer):
    """
    Calculates the availability of an item based on its total quantity minus 
    the quantity from active requests that overlap a specified date range.
    """
    availability = serializers.SerializerMethodField()
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'condition', 'quantity', 'availability']
        
    def get_availability(self, item):
        context = self.context
        from_date_str = context.get('from_date')
        to_date_str = context.get('to_date')
        
        # Initialize total requested quantity to 0
        total_requested = 0
        from_date_obj = None
        to_date_obj = None
        
        # 1. Attempt to parse dates only if they are present
        if from_date_str and to_date_str:
            try:
                from_date_obj = date.fromisoformat(from_date_str)
                to_date_obj = date.fromisoformat(to_date_str)
            except ValueError:
                print(f"ERROR: Date format is invalid for range check. Returning full quantity.")
                return item.quantity

            # 2. Define statuses (used only when dates are valid and present)
            default_statuses = ['approved', 'issued']
            active_statuses_from_context = context.get('active_statuses')
            
            if active_statuses_from_context:
                active_statuses = [s.lower() for s in active_statuses_from_context]
            else:
                active_statuses = default_statuses

            overlapping_requests = LendingRequest.objects.filter(
                item=item,
                status__in=active_statuses,
                from_date__lte=to_date_obj, 
                to_date__gte=from_date_obj
            ).aggregate(
                total_requested=Sum('quantity')
            )
            
            # Update total requested quantity
            total_requested = overlapping_requests.get('total_requested') or 0
            #print(f"DEBUG: Total requested quantity found: {total_requested}")
            #print(f"DEBUG: ITEM quantity ===: {item.quantity}")
        
        # 5. Final Calculation: This runs whether total_requested is 0 (no dates) or > 0 (dates checked)
        return (item.quantity - total_requested)
