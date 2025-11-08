import os
import django
from django.db import connection

# Set up the Django environment
# Replace 'SELP.settings' with the path to your settings file if it's different
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SELP.settings') 
django.setup()

def execute_sequence_query():
    """
    Connects to the database and executes the query to retrieve 
    the SQLite sequence counter for the EquipmentItem table.
    """
    
    # Use the correct table name: appname_modelname (in lowercase)
    TABLE_NAME = 'equipment_item' 

    try:
        with connection.cursor() as cursor:
            # Execute the query
            cursor.execute(f"SELECT seq FROM sqlite_sequence WHERE name='{TABLE_NAME}';")
            
            # Fetch the result
            result = cursor.fetchone()
            
            if result:
                print(f"Current Sequence for '{TABLE_NAME}': {result[0]}")
            else:
                print(f"Sequence entry not found for '{TABLE_NAME}'.")
                print("This means the table exists, but no data has been inserted yet.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    execute_sequence_query()