# from bson import ObjectId
# from datetime import datetime
# import re

# def serialize_doc(doc):
#     """Convert MongoDB document to JSON serializable format"""
#     if doc:
#         if '_id' in doc:
#             doc['id'] = str(doc['_id'])
#             del doc['_id']
#         # Convert other ObjectId fields
#         for key, value in doc.items():
#             if isinstance(value, ObjectId):
#                 doc[key] = str(value)
#     return doc

# def serialize_docs(docs):
#     """Convert list of MongoDB documents to JSON serializable format"""
#     return [serialize_doc(doc) for doc in docs]

# def validate_email(email):
#     """Validate email format"""
#     pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
#     return re.match(pattern, email) is not None

# def validate_phone(phone):
#     """Validate phone number format"""
#     pattern = r'^\+?[\d\s\-\(\)]{10,15}$'
#     return re.match(pattern, phone) is not None

# def calculate_interest(principal, rate, months):
#     """Calculate simple interest"""
#     return (principal * rate * months) / (12 * 100)

# def format_currency(amount):
#     """Format amount as currency"""
#     return f"₹{amount:,.2f}"

# def get_current_timestamp():
#     """Get current UTC timestamp"""
#     return datetime.utcnow().isoformat()

# def validate_object_id(id_string):
#     """Validate if string is a valid ObjectId"""
#     try:
#         ObjectId(id_string)
#         return True
#     except:
#         return False

# from datetime import datetime
# import re
# import mysql.connector
# from mysql.connector import Error
# from contextlib import contextmanager

# def get_db_connection():
#     """Get MySQL database connection"""
#     try:
#         from config import Config
#         connection = mysql.connector.connect(
#             host=Config.DB_HOST,
#             port=Config.DB_PORT,
#             database=Config.DB_NAME,
#             user=Config.DB_USER,
#             password=Config.DB_PASSWORD,
#             charset=Config.DB_CHARSET,
#             collation=Config.DB_COLLATION,
#             autocommit=True
#         )
#         return connection
#     except Error as e:
#         print(f"Error connecting to MySQL: {e}")
#         return None

# @contextmanager
# def get_db_cursor():
#     """Context manager for database cursor"""
#     connection = get_db_connection()
#     if connection:
#         cursor = connection.cursor(dictionary=True)
#         try:
#             yield cursor
#         finally:
#             cursor.close()
#             connection.close()
#     else:
#         yield None

# def serialize_doc(doc):
#     """Convert MySQL result to JSON serializable format"""
#     if doc:
#         # Convert datetime objects to ISO format strings
#         for key, value in doc.items():
#             if isinstance(value, datetime):
#                 doc[key] = value.isoformat()
#     return doc

# def serialize_docs(docs):
#     """Convert list of MySQL results to JSON serializable format"""
#     return [serialize_doc(doc) for doc in docs]

# def validate_email(email):
#     """Validate email format"""
#     pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
#     return re.match(pattern, email) is not None

# def validate_phone(phone):
#     """Validate phone number format"""
#     pattern = r'^\+?[\d\s\-\(\)]{10,15}$'
#     return re.match(pattern, phone) is not None

# def calculate_interest(principal, rate, months):
#     """Calculate simple interest"""
#     return (principal * rate * months) / (12 * 100)

# def calculate_total_amount(principal, rate, months):
#     """Calculate total amount including interest"""
#     interest = calculate_interest(principal, rate, months)
#     return principal + interest

# def format_currency(amount):
#     """Format amount as currency"""
#     return f"₹{amount:,.2f}"

# def get_current_timestamp():
#     """Get current UTC timestamp"""
#     return datetime.utcnow().isoformat()

# def validate_id(id_value):
#     """Validate if value is a valid positive integer ID"""
#     try:
#         id_int = int(id_value)
#         return id_int > 0
#     except (ValueError, TypeError):
#         return False

# def execute_query(query, params=None, fetch_one=False, fetch_all=False):
#     """Execute a query and return results"""
#     with get_db_cursor() as cursor:
#         if cursor is None:
#             return None
        
#         try:
#             cursor.execute(query, params or ())
            
#             if fetch_one:
#                 return cursor.fetchone()
#             elif fetch_all:
#                 return cursor.fetchall()
#             else:
#                 return cursor.rowcount
#         except Error as e:
#             print(f"Database error: {e}")
#             return None

# def insert_and_get_id(query, params=None):
#     """Execute insert query and return the inserted ID"""
#     connection = get_db_connection()
#     if not connection:
#         return None
    
#     cursor = connection.cursor()
#     try:
#         cursor.execute(query, params or ())
#         connection.commit()
#         return cursor.lastrowid
#     except Error as e:
#         print(f"Database error: {e}")
#         connection.rollback()
#         return None
#     finally:
#         cursor.close()
#         connection.close()

# def build_update_query(table, data, id_field='id'):
#     """Build UPDATE query from dictionary data"""
#     if not data:
#         return None, None
    
#     set_clause = ', '.join([f"{key} = %s" for key in data.keys()])
#     query = f"UPDATE {table} SET {set_clause} WHERE {id_field} = %s"
#     params = list(data.values())
    
#     return query, params

# def build_insert_query(table, data):
#     """Build INSERT query from dictionary data"""
#     if not data:
#         return None, None
    
#     columns = ', '.join(data.keys())
#     placeholders = ', '.join(['%s'] * len(data))
#     query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
#     params = list(data.values())
    
#     return query, params

from datetime import datetime
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def serialize_doc(doc):
    """Convert SQL Server result to JSON serializable format"""
    if doc:
        # Convert datetime objects to ISO format strings
        for key, value in doc.items():
            if isinstance(value, datetime):
                doc[key] = value.isoformat()
            elif value is None:
                doc[key] = None
    return doc

def serialize_docs(docs):
    """Convert list of SQL Server results to JSON serializable format"""
    return [serialize_doc(doc) for doc in docs]

def validate_email(email):
    """Validate email format"""
    if not email:
        return True  # Email is optional
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True  # Phone is optional
    pattern = r'^\+?[\d\s\-\(\)]{10,15}$'
    return re.match(pattern, phone) is not None

def calculate_interest(principal, rate, months):
    """Calculate simple interest"""
    return (principal * rate * months) / (12 * 100)

def calculate_total_amount(principal, rate, months):
    """Calculate total amount including interest"""
    interest = calculate_interest(principal, rate, months)
    return principal + interest

def format_currency(amount):
    """Format amount as currency"""
    return f"₹{amount:,.2f}"

def get_current_timestamp():
    """Get current UTC timestamp"""
    return datetime.utcnow().isoformat()

def validate_id(id_value):
    """Validate if value is a valid ID (string or positive integer)"""
    if not id_value:
        return False
    
    # Convert to string if it's not already
    id_str = str(id_value).strip()
    
    # Check if it's empty after stripping
    if not id_str:
        return False
    
    # For SQL Server IDENTITY columns, check if it's a positive integer
    try:
        id_int = int(id_str)
        return id_int > 0
    except (ValueError, TypeError):
        # If it's not a number, check if it's a valid string ID
        return len(id_str) > 0 and not id_str.isspace()