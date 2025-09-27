import pyodbc
from datetime import datetime
import os
from typing import Optional, List, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseConnection:
    def __init__(self):
        # SQL Server connection parameters
        self.server = os.getenv('SQL_SERVER', 'localhost\\MSSQLSERVER01')
        self.database = os.getenv('SQL_DATABASE', 'village_management')
        self.username = os.getenv('SQL_USERNAME', 'suresh')
        self.password = os.getenv('SQL_PASSWORD', 'suresh')
        
        # Try different connection methods
        self.connection_methods = [
            # Method 1: Windows Authentication (if running on Windows)
            f"""
            DRIVER={{ODBC Driver 17 for SQL Server}};
            SERVER={self.server};
            DATABASE={self.database};
            Trusted_Connection=yes;
            TrustServerCertificate=yes;
            """,
            
            # Method 2: SQL Server Authentication
            f"""
            DRIVER={{ODBC Driver 17 for SQL Server}};
            SERVER={self.server};
            DATABASE={self.database};
            UID={self.username};
            PWD={self.password};
            TrustServerCertificate=yes;
            """,
            
            # Method 3: TCP/IP connection
            f"""
            DRIVER={{ODBC Driver 17 for SQL Server}};
            SERVER={self.server},1433;
            DATABASE={self.database};
            UID={self.username};
            PWD={self.password};
            TrustServerCertificate=yes;
            """,
            
            # Method 4: Local connection with different server name
            f"""
            DRIVER={{ODBC Driver 17 for SQL Server}};
            SERVER=(local);
            DATABASE={self.database};
            UID={self.username};
            PWD={self.password};
            TrustServerCertificate=yes;
            """
        ]
    
    def get_connection(self):
        """Try different connection methods"""
        for i, connection_string in enumerate(self.connection_methods, 1):
            try:
                logger.info(f"Attempting connection method {i}")
                connection = pyodbc.connect(connection_string.strip())
                logger.info(f"Successfully connected using method {i}")
                return connection
            except Exception as e:
                logger.warning(f"Connection method {i} failed: {e}")
                continue
        
        logger.error("All connection methods failed")
        return None
    
    def test_connection(self):
        """Test database connection and return status"""
        try:
            connection = self.get_connection()
            if connection:
                cursor = connection.cursor()
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                connection.close()
                return True, "Database connection successful"
            else:
                return False, "Could not establish database connection"
        except Exception as e:
            return False, f"Database connection test failed: {str(e)}"

class BaseModel:
    def __init__(self, table_name: str):
        self.table_name = table_name
        self.db = DatabaseConnection()
    
    def create(self, data: Dict[str, Any]) -> Optional[str]:
        """Insert a new record and return its ID"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                logger.error("No database connection available")
                return None
            
            cursor = connection.cursor()
            
            # Add created_at timestamp
            data['created_at'] = datetime.utcnow()
            data['updated_at'] = datetime.utcnow()
            
            # Build INSERT query
            columns = ', '.join(data.keys())
            placeholders = ', '.join(['?' for _ in data.values()])
            query = f"INSERT INTO {self.table_name} ({columns}) OUTPUT INSERTED.id VALUES ({placeholders})"
            
            logger.info(f"Executing query: {query}")
            logger.info(f"With values: {list(data.values())}")
            
            cursor.execute(query, list(data.values()))
            result = cursor.fetchone()
            connection.commit()
            
            if result:
                logger.info(f"Successfully created record with ID: {result[0]}")
                return str(result[0])
            else:
                logger.error("No ID returned from insert")
                return None
            
        except Exception as e:
            logger.error(f"Error creating record in {self.table_name}: {e}")
            if connection:
                connection.rollback()
            return None
        finally:
            if connection:
                connection.close()
    
    def find_by_id(self, record_id: str) -> Optional[Dict[str, Any]]:
        """Find a record by ID"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return None
            
            cursor = connection.cursor()
            cursor.execute(f"SELECT * FROM {self.table_name} WHERE id = ?", (record_id,))
            
            columns = [column[0] for column in cursor.description]
            row = cursor.fetchone()
            
            if row:
                return dict(zip(columns, row))
            return None
            
        except Exception as e:
            logger.error(f"Error finding record by ID in {self.table_name}: {e}")
            return None
        finally:
            if connection:
                connection.close()
    
    def find_all(self, where_clause: str = "", params: tuple = ()) -> List[Dict[str, Any]]:
        """Find all records with optional WHERE clause"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return []
            
            cursor = connection.cursor()
            query = f"SELECT * FROM {self.table_name}"
            if where_clause:
                query += f" WHERE {where_clause}"
            
            cursor.execute(query, params)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            
            return [dict(zip(columns, row)) for row in rows]
            
        except Exception as e:
            logger.error(f"Error finding records in {self.table_name}: {e}")
            return []
        finally:
            if connection:
                connection.close()
    
    def update(self, record_id: str, data: Dict[str, Any]) -> bool:
        """Update a record by ID"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return False
            
            cursor = connection.cursor()
            
            # Add updated_at timestamp
            data['updated_at'] = datetime.utcnow()
            
            # Build UPDATE query
            set_clause = ', '.join([f"{key} = ?" for key in data.keys()])
            query = f"UPDATE {self.table_name} SET {set_clause} WHERE id = ?"
            
            params = list(data.values()) + [record_id]
            cursor.execute(query, params)
            
            rows_affected = cursor.rowcount
            connection.commit()
            
            return rows_affected > 0
            
        except Exception as e:
            logger.error(f"Error updating record in {self.table_name}: {e}")
            if connection:
                connection.rollback()
            return False
        finally:
            if connection:
                connection.close()
    
    def delete(self, record_id: str) -> bool:
        """Delete a record by ID"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return False
            
            cursor = connection.cursor()
            cursor.execute(f"DELETE FROM {self.table_name} WHERE id = ?", (record_id,))
            
            rows_affected = cursor.rowcount
            connection.commit()
            
            return rows_affected > 0
            
        except Exception as e:
            logger.error(f"Error deleting record in {self.table_name}: {e}")
            if connection:
                connection.rollback()
            return False
        finally:
            if connection:
                connection.close()
    
    def count(self, where_clause: str = "", params: tuple = ()) -> int:
        """Count records with optional WHERE clause"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return 0
            
            cursor = connection.cursor()
            query = f"SELECT COUNT(*) FROM {self.table_name}"
            if where_clause:
                query += f" WHERE {where_clause}"
            
            cursor.execute(query, params)
            result = cursor.fetchone()
            
            return result[0] if result else 0
            
        except Exception as e:
            logger.error(f"Error counting records in {self.table_name}: {e}")
            return 0
        finally:
            if connection:
                connection.close()

class UserModel(BaseModel):
    def __init__(self):
        super().__init__('users')
    
    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Find user by email"""
        results = self.find_all("email = ?", (email,))
        return results[0] if results else None

class VillageModel(BaseModel):
    def __init__(self):
        super().__init__('villages')
    
    def find_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        """Find village by code"""
        results = self.find_all("code = ?", (code,))
        return results[0] if results else None
    
    def code_exists(self, code: str, exclude_id: str = None) -> bool:
        """Check if village code exists (optionally excluding a specific ID)"""
        if exclude_id:
            results = self.find_all("code = ? AND id != ?", (code, exclude_id))
        else:
            results = self.find_all("code = ?", (code,))
        return len(results) > 0
    
    def get_all_with_stats(self) -> List[Dict[str, Any]]:
        """Get all villages with customer and loan statistics"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return []
            
            cursor = connection.cursor()
            query = """
            SELECT 
                v.*,
                COALESCE(c.customer_count, 0) as totalCustomers,
                COALESCE(l.loan_count, 0) as totalLoans,
                COALESCE(l.total_amount, 0) as totalAmount
            FROM villages v
            LEFT JOIN (
                SELECT village_id, COUNT(*) as customer_count
                FROM customers
                GROUP BY village_id
            ) c ON v.id = c.village_id
            LEFT JOIN (
                SELECT village_id, COUNT(*) as loan_count, SUM(total_amount) as total_amount
                FROM loans
                GROUP BY village_id
            ) l ON v.id = l.village_id
            ORDER BY v.name
            """
            
            cursor.execute(query)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            
            return [dict(zip(columns, row)) for row in rows]
            
        except Exception as e:
            logger.error(f"Error getting villages with stats: {e}")
            return []
        finally:
            if connection:
                connection.close()

class CustomerModel(BaseModel):
    def __init__(self):
        super().__init__('customers')
    
    def find_by_village(self, village_id: str) -> List[Dict[str, Any]]:
        """Find customers by village ID"""
        return self.find_all("village_id = ?", (village_id,))
    
    def find_with_village_info(self, customer_id: str = None) -> List[Dict[str, Any]]:
        """Find customers with village information"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return [] if not customer_id else None
            
            cursor = connection.cursor()
            query = """
            SELECT 
                c.*,
                v.name as villageName,
                v.code as villageCode,
                COALESCE(l.total_loan_amount, 0) as totalLoanAmount,
                COALESCE(l.total_paid_amount, 0) as totalPaidAmount,
                COALESCE(l.total_loan_amount - l.total_paid_amount, 0) as remainingAmount
            FROM customers c
            LEFT JOIN villages v ON c.village_id = v.id
            LEFT JOIN (
                SELECT 
                    customer_id,
                    SUM(total_amount) as total_loan_amount,
                    SUM(paid_amount) as total_paid_amount
                FROM loans
                GROUP BY customer_id
            ) l ON c.id = l.customer_id
            """
            
            params = ()
            if customer_id:
                query += " WHERE c.id = ?"
                params = (customer_id,)
            
            query += " ORDER BY c.name"
            
            cursor.execute(query, params)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            
            result = [dict(zip(columns, row)) for row in rows]
            return result[0] if customer_id and result else result
            
        except Exception as e:
            logger.error(f"Error finding customers with village info: {e}")
            return [] if not customer_id else None
        finally:
            if connection:
                connection.close()

class LoanModel(BaseModel):
    def __init__(self):
        super().__init__('loans')
    
    def find_by_customer(self, customer_id: str) -> List[Dict[str, Any]]:
        """Find loans by customer ID"""
        return self.find_all("customer_id = ?", (customer_id,))
    
    def find_by_village(self, village_id: str) -> List[Dict[str, Any]]:
        """Find loans by village ID"""
        return self.find_all("village_id = ?", (village_id,))
    
    def find_with_customer_info(self, loan_id: str = None) -> List[Dict[str, Any]]:
        """Find loans with customer and village information"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return [] if not loan_id else None
            
            cursor = connection.cursor()
            query = """
            SELECT 
                l.*,
                c.name as customerName,
                c.email as customerEmail,
                c.phone as customerPhone,
                v.name as villageName,
                v.code as villageCode,
                l.principal_amount as amount,
                l.total_amount as totalAmount,
                l.paid_amount as paidAmount,
                l.pending_amount as remainingAmount
            FROM loans l
            LEFT JOIN customers c ON l.customer_id = c.id
            LEFT JOIN villages v ON l.village_id = v.id
            """
            
            params = ()
            if loan_id:
                query += " WHERE l.id = ?"
                params = (loan_id,)
            
            query += " ORDER BY l.created_at DESC"
            
            cursor.execute(query, params)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            
            result = [dict(zip(columns, row)) for row in rows]
            return result[0] if loan_id and result else result
            
        except Exception as e:
            logger.error(f"Error finding loans with customer info: {e}")
            return [] if not loan_id else None
        finally:
            if connection:
                connection.close()
    
    def update_paid_amount(self, loan_id: str, payment_amount: float) -> bool:
        """Update paid amount and pending amount for a loan"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return False
            
            cursor = connection.cursor()
            
            # Update paid amount and recalculate pending amount
            query = """
            UPDATE loans 
            SET 
                paid_amount = paid_amount + ?,
                pending_amount = total_amount - (paid_amount + ?),
                updated_at = ?
            WHERE id = ?
            """
            
            cursor.execute(query, (payment_amount, payment_amount, datetime.utcnow(), loan_id))
            
            rows_affected = cursor.rowcount
            connection.commit()
            
            return rows_affected > 0
            
        except Exception as e:
            logger.error(f"Error updating loan paid amount: {e}")
            if connection:
                connection.rollback()
            return False
        finally:
            if connection:
                connection.close()

class PaymentModel(BaseModel):
    def __init__(self):
        super().__init__('payments')
    
    def find_by_loan(self, loan_id: str) -> List[Dict[str, Any]]:
        """Find payments by loan ID"""
        return self.find_all("loan_id = ?", (loan_id,))
    
    def find_by_customer(self, customer_id: str) -> List[Dict[str, Any]]:
        """Find payments by customer ID"""
        return self.find_all("customer_id = ?", (customer_id,))
    
    def find_with_loan_info(self, payment_id: str = None) -> List[Dict[str, Any]]:
        """Find payments with loan and customer information"""
        connection = None
        try:
            connection = self.db.get_connection()
            if not connection:
                return [] if not payment_id else None
            
            cursor = connection.cursor()
            query = """
            SELECT 
                p.*,
                c.name as customerName,
                l.principal_amount,
                l.total_amount as loan_total_amount,
                v.name as villageName,
                p.payment_date as date,
                p.payment_method as method,
                p.reference_number as reference,
                p.notes
            FROM payments p
            LEFT JOIN loans l ON p.loan_id = l.id
            LEFT JOIN customers c ON p.customer_id = c.id
            LEFT JOIN villages v ON l.village_id = v.id
            """
            
            params = ()
            if payment_id:
                query += " WHERE p.id = ?"
                params = (payment_id,)
            
            query += " ORDER BY p.payment_date DESC"
            
            cursor.execute(query, params)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            
            result = [dict(zip(columns, row)) for row in rows]
            return result[0] if payment_id and result else result
            
        except Exception as e:
            logger.error(f"Error finding payments with loan info: {e}")
            return [] if not payment_id else None
        finally:
            if connection:
                connection.close()