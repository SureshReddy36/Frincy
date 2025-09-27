import pyodbc
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseSetup:
    def __init__(self):
        # SQL Server connection parameters
        self.server = os.getenv('SQL_SERVER', 'localhost\\MSSQLSERVER01')
        self.database = os.getenv('SQL_DATABASE', 'village_management')
        self.username = os.getenv('SQL_USERNAME', 'suresh')
        self.password = os.getenv('SQL_PASSWORD', 'suresh')
        
        # Connection methods to try
        self.connection_methods = [
            # Method 1: Windows Authentication
            f"""
            DRIVER={{ODBC Driver 17 for SQL Server}};
            SERVER={self.server};
            DATABASE=master;
            Trusted_Connection=yes;
            TrustServerCertificate=yes;
            """,
            
            # Method 2: SQL Server Authentication
            f"""
            DRIVER={{ODBC Driver 17 for SQL Server}};
            SERVER={self.server};
            DATABASE=master;
            UID={self.username};
            PWD={self.password};
            TrustServerCertificate=yes;
            """,
            
            # Method 3: Local connection
            f"""
            DRIVER={{ODBC Driver 17 for SQL Server}};
            SERVER=(local);
            DATABASE=master;
            UID={self.username};
            PWD={self.password};
            TrustServerCertificate=yes;
            """
        ]
    
    def get_connection(self, use_database=True):
        """Try different connection methods"""
        for i, connection_string in enumerate(self.connection_methods, 1):
            try:
                if use_database:
                    connection_string = connection_string.replace('DATABASE=master', f'DATABASE={self.database}')
                
                logger.info(f"Attempting connection method {i}")
                connection = pyodbc.connect(connection_string.strip())
                logger.info(f"Successfully connected using method {i}")
                return connection
            except Exception as e:
                logger.warning(f"Connection method {i} failed: {e}")
                continue
        
        logger.error("All connection methods failed")
        return None
    
    def create_database(self):
        """Create the database if it doesn't exist"""
        try:
            connection = self.get_connection(use_database=False)
            if not connection:
                logger.error("Could not connect to SQL Server")
                return False
            
            cursor = connection.cursor()
            
            # Check if database exists
            cursor.execute(f"SELECT name FROM sys.databases WHERE name = '{self.database}'")
            if cursor.fetchone():
                logger.info(f"Database '{self.database}' already exists")
                connection.close()
                return True
            
            # Create database
            cursor.execute(f"CREATE DATABASE [{self.database}]")
            connection.commit()
            logger.info(f"Database '{self.database}' created successfully")
            connection.close()
            return True
            
        except Exception as e:
            logger.error(f"Error creating database: {e}")
            return False
    
    def create_tables(self):
        """Create all required tables"""
        try:
            connection = self.get_connection()
            if not connection:
                logger.error("Could not connect to database")
                return False
            
            cursor = connection.cursor()
            
            # Create tables
            tables = [
                # Users table
                """
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
                CREATE TABLE users (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(255) NOT NULL,
                    email NVARCHAR(255) UNIQUE NOT NULL,
                    password NVARCHAR(255) NOT NULL,
                    role NVARCHAR(50) DEFAULT 'user',
                    created_at DATETIME2 DEFAULT GETUTCDATE(),
                    updated_at DATETIME2 DEFAULT GETUTCDATE()
                )
                """,
                
                # Villages table
                """
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='villages' AND xtype='U')
                CREATE TABLE villages (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(255) NOT NULL,
                    code NVARCHAR(50) UNIQUE NOT NULL,
                    description NVARCHAR(MAX),
                    created_at DATETIME2 DEFAULT GETUTCDATE(),
                    updated_at DATETIME2 DEFAULT GETUTCDATE()
                )
                """,
                
                # Customers table
                """
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='customers' AND xtype='U')
                CREATE TABLE customers (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(255) NOT NULL,
                    village_id INT NOT NULL,
                    email NVARCHAR(255),
                    phone NVARCHAR(20),
                    address NVARCHAR(MAX),
                    created_at DATETIME2 DEFAULT GETUTCDATE(),
                    updated_at DATETIME2 DEFAULT GETUTCDATE(),
                    FOREIGN KEY (village_id) REFERENCES villages(id)
                )
                """,
                
                # Loans table
                """
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='loans' AND xtype='U')
                CREATE TABLE loans (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    customer_id INT NOT NULL,
                    village_id INT NOT NULL,
                    principal_amount DECIMAL(15,2) NOT NULL,
                    interest_rate DECIMAL(5,2) NOT NULL,
                    loan_period_months INT NOT NULL,
                    total_amount DECIMAL(15,2) NOT NULL,
                    paid_amount DECIMAL(15,2) DEFAULT 0.00,
                    pending_amount DECIMAL(15,2) NOT NULL,
                    status NVARCHAR(20) DEFAULT 'active',
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    created_at DATETIME2 DEFAULT GETUTCDATE(),
                    updated_at DATETIME2 DEFAULT GETUTCDATE(),
                    FOREIGN KEY (customer_id) REFERENCES customers(id),
                    FOREIGN KEY (village_id) REFERENCES villages(id)
                )
                """,
                
                # Payments table
                """
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='payments' AND xtype='U')
                CREATE TABLE payments (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    loan_id INT NOT NULL,
                    customer_id INT NOT NULL,
                    amount DECIMAL(15,2) NOT NULL,
                    payment_date DATE NOT NULL,
                    payment_method NVARCHAR(50) NOT NULL,
                    reference_number NVARCHAR(100),
                    notes NVARCHAR(MAX),
                    created_at DATETIME2 DEFAULT GETUTCDATE(),
                    updated_at DATETIME2 DEFAULT GETUTCDATE(),
                    FOREIGN KEY (loan_id) REFERENCES loans(id),
                    FOREIGN KEY (customer_id) REFERENCES customers(id)
                )
                """
            ]
            
            for table_sql in tables:
                cursor.execute(table_sql)
                connection.commit()
            
            logger.info("All tables created successfully")
            connection.close()
            return True
            
        except Exception as e:
            logger.error(f"Error creating tables: {e}")
            return False
    
    def insert_sample_data(self):
        """Insert sample data for testing"""
        try:
            connection = self.get_connection()
            if not connection:
                return False
            
            cursor = connection.cursor()
            
            # Check if data already exists
            cursor.execute("SELECT COUNT(*) FROM villages")
            if cursor.fetchone()[0] > 0:
                logger.info("Sample data already exists")
                connection.close()
                return True
            
            # Insert sample villages
            villages = [
                ('Rampur', 'RAM001', 'A beautiful village in the countryside'),
                ('Krishnagar', 'KRI002', 'Known for its agricultural activities'),
                ('Sundarpur', 'SUN003', 'A peaceful village near the river')
            ]
            
            for village in villages:
                cursor.execute(
                    "INSERT INTO villages (name, code, description) VALUES (?, ?, ?)",
                    village
                )
            
            connection.commit()
            logger.info("Sample data inserted successfully")
            connection.close()
            return True
            
        except Exception as e:
            logger.error(f"Error inserting sample data: {e}")
            return False
    
    def setup_complete_database(self):
        """Complete database setup"""
        logger.info("Starting database setup...")
        
        if not self.create_database():
            logger.error("Failed to create database")
            return False
        
        if not self.create_tables():
            logger.error("Failed to create tables")
            return False
        
        if not self.insert_sample_data():
            logger.error("Failed to insert sample data")
            return False
        
        logger.info("Database setup completed successfully!")
        return True

if __name__ == "__main__":
    setup = DatabaseSetup()
    setup.setup_complete_database()