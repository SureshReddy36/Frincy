# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# from werkzeug.security import generate_password_hash, check_password_hash
# from pymongo import MongoClient
# from bson import ObjectId
# from datetime import datetime, timedelta
# import os
# from functools import wraps

# # Initialize Flask app
# app = Flask(__name__)
# app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# # Initialize extensions
# jwt = JWTManager(app)
# CORS(app)

# # MongoDB connection
# MONGO_URI = "mongodb+srv://sureshreddy:suresh@cluster0.8kjtxsl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# client = MongoClient(MONGO_URI)
# db = client.village_management

# # Collections
# users_collection = db.users
# villages_collection = db.villages
# customers_collection = db.customers
# loans_collection = db.loans
# payments_collection = db.payments

# # Helper functions
# def serialize_doc(doc):
#     """Convert MongoDB document to JSON serializable format"""
#     if doc:
#         doc['id'] = str(doc['_id'])
#         del doc['_id']
#     return doc

# def serialize_docs(docs):
#     """Convert list of MongoDB documents to JSON serializable format"""
#     return [serialize_doc(doc) for doc in docs]

# # Error handlers
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({'error': 'Not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     return jsonify({'error': 'Internal server error'}), 500

# # Auth routes
# @app.route('/api/auth/register', methods=['POST'])
# def register():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         email = data.get('email')
#         password = data.get('password')

#         if not all([name, email, password]):
#             return jsonify({'message': 'All fields are required'}), 400

#         # Check if user already exists
#         if users_collection.find_one({'email': email}):
#             return jsonify({'message': 'User already exists'}), 400

#         # Create new user
#         hashed_password = generate_password_hash(password)
#         user_data = {
#             'name': name,
#             'email': email,
#             'password': hashed_password,
#             'role': 'user',
#             'createdAt': datetime.utcnow().isoformat()
#         }
        
#         result = users_collection.insert_one(user_data)
#         user_data['id'] = str(result.inserted_id)
#         del user_data['_id']
#         del user_data['password']

#         # Create access token
#         access_token = create_access_token(identity=user_data['id'])

#         return jsonify({
#             'access_token': access_token,
#             'user': user_data
#         }), 201

#     except Exception as e:
#         return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

# @app.route('/api/auth/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')

#         if not all([email, password]):
#             return jsonify({'message': 'Email and password are required'}), 400

#         # Find user
#         user = users_collection.find_one({'email': email})
#         if not user or not check_password_hash(user['password'], password):
#             return jsonify({'message': 'Invalid credentials'}), 401

#         # Create access token
#         access_token = create_access_token(identity=str(user['_id']))
        
#         user_data = serialize_doc(user)
#         del user_data['password']

#         return jsonify({
#             'access_token': access_token,
#             'user': user_data
#         }), 200

#     except Exception as e:
#         return jsonify({'message': 'Login failed', 'error': str(e)}), 500

# @app.route('/api/auth/profile', methods=['GET'])
# @jwt_required()
# def get_profile():
#     try:
#         user_id = get_jwt_identity()
#         user = users_collection.find_one({'_id': ObjectId(user_id)})
        
#         if not user:
#             return jsonify({'message': 'User not found'}), 404

#         user_data = serialize_doc(user)
#         del user_data['password']
        
#         return jsonify(user_data), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get profile', 'error': str(e)}), 500

# # Villages routes
# @app.route('/api/villages', methods=['GET'])
# @jwt_required()
# def get_villages():
#     try:
#         villages = list(villages_collection.find())
        
#         # Calculate stats for each village
#         for village in villages:
#             village_id = str(village['_id'])
#             customers_count = customers_collection.count_documents({'villageId': village_id})
#             loans_count = loans_collection.count_documents({'villageId': village_id})
            
#             # Calculate total amount
#             total_amount = 0
#             loans = loans_collection.find({'villageId': village_id})
#             for loan in loans:
#                 total_amount += loan.get('totalAmount', 0)
            
#             village['totalCustomers'] = customers_count
#             village['totalLoans'] = loans_count
#             village['totalAmount'] = total_amount

#         return jsonify(serialize_docs(villages)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get villages', 'error': str(e)}), 500

# @app.route('/api/villages', methods=['POST'])
# @jwt_required()
# def create_village():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         code = data.get('code')
#         description = data.get('description', '')

#         if not all([name, code]):
#             return jsonify({'message': 'Name and code are required'}), 400

#         # Check if village code already exists
#         if villages_collection.find_one({'code': code}):
#             return jsonify({'message': 'Village code already exists'}), 400

#         village_data = {
#             'name': name,
#             'code': code,
#             'description': description,
#             'totalCustomers': 0,
#             'totalLoans': 0,
#             'totalAmount': 0,
#             'createdAt': datetime.utcnow().isoformat()
#         }

#         result = villages_collection.insert_one(village_data)
#         village_data['id'] = str(result.inserted_id)
#         del village_data['_id']

#         return jsonify(village_data), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create village', 'error': str(e)}), 500

# @app.route('/api/villages/<village_id>', methods=['PUT'])
# @jwt_required()
# def update_village(village_id):
#     try:
#         data = request.get_json()
        
#         update_data = {}
#         if 'name' in data:
#             update_data['name'] = data['name']
#         if 'code' in data:
#             # Check if new code conflicts with existing villages
#             existing = villages_collection.find_one({
#                 'code': data['code'], 
#                 '_id': {'$ne': ObjectId(village_id)}
#             })
#             if existing:
#                 return jsonify({'message': 'Village code already exists'}), 400
#             update_data['code'] = data['code']
#         if 'description' in data:
#             update_data['description'] = data['description']

#         result = villages_collection.update_one(
#             {'_id': ObjectId(village_id)},
#             {'$set': update_data}
#         )

#         if result.matched_count == 0:
#             return jsonify({'message': 'Village not found'}), 404

#         village = villages_collection.find_one({'_id': ObjectId(village_id)})
#         return jsonify(serialize_doc(village)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to update village', 'error': str(e)}), 500

# @app.route('/api/villages/<village_id>', methods=['DELETE'])
# @jwt_required()
# def delete_village(village_id):
#     try:
#         # Check if village has customers
#         customers_count = customers_collection.count_documents({'villageId': village_id})
#         if customers_count > 0:
#             return jsonify({'message': 'Cannot delete village with existing customers'}), 400

#         result = villages_collection.delete_one({'_id': ObjectId(village_id)})
        
#         if result.deleted_count == 0:
#             return jsonify({'message': 'Village not found'}), 404

#         return jsonify({'message': 'Village deleted successfully'}), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to delete village', 'error': str(e)}), 500

# # Dashboard routes
# @app.route('/api/dashboard/stats', methods=['GET'])
# @jwt_required()
# def get_dashboard_stats():
#     try:
#         total_villages = villages_collection.count_documents({})
#         total_customers = customers_collection.count_documents({})
#         total_loans = loans_collection.count_documents({})
        
#         # Calculate amounts
#         total_amount = 0
#         total_paid = 0
        
#         loans = loans_collection.find()
#         for loan in loans:
#             total_amount += loan.get('totalAmount', 0)
#             total_paid += loan.get('paidAmount', 0)
        
#         total_pending = total_amount - total_paid

#         stats = {
#             'totalVillages': total_villages,
#             'totalCustomers': total_customers,
#             'totalLoans': total_loans,
#             'totalAmount': total_amount,
#             'totalPaid': total_paid,
#             'totalPending': total_pending,
#             'recentActivity': []
#         }

#         return jsonify(stats), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get dashboard stats', 'error': str(e)}), 500

# # Health check route
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# from werkzeug.security import generate_password_hash, check_password_hash
# from datetime import datetime, timedelta
# import os
# from functools import wraps

# # Import our models and utilities
# from models import UserModel, VillageModel, CustomerModel, LoanModel, PaymentModel
# from utils import serialize_doc, serialize_docs, validate_email, validate_phone, validate_id, calculate_total_amount

# # Initialize Flask app
# app = Flask(__name__)
# app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# # Initialize extensions
# jwt = JWTManager(app)
# CORS(app)

# # Initialize models
# user_model = UserModel()
# village_model = VillageModel()
# customer_model = CustomerModel()
# loan_model = LoanModel()
# payment_model = PaymentModel()

# # Error handlers
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({'error': 'Not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     return jsonify({'error': 'Internal server error'}), 500

# # Auth routes
# @app.route('/api/auth/register', methods=['POST'])
# def register():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         email = data.get('email')
#         password = data.get('password')

#         if not all([name, email, password]):
#             return jsonify({'message': 'All fields are required'}), 400

#         if not validate_email(email):
#             return jsonify({'message': 'Invalid email format'}), 400

#         # Check if user already exists
#         if user_model.find_by_email(email):
#             return jsonify({'message': 'User already exists'}), 400

#         # Create new user
#         hashed_password = generate_password_hash(password)
#         user_data = {
#             'name': name,
#             'email': email,
#             'password': hashed_password,
#             'role': 'user'
#         }
        
#         user_id = user_model.create(user_data)
#         if not user_id:
#             return jsonify({'message': 'Failed to create user'}), 500
        
#         # Get created user (without password)
#         user = user_model.find_by_id(user_id)
#         del user['password']

#         # Create access token
#         access_token = create_access_token(identity=str(user_id))

#         return jsonify({
#             'access_token': access_token,
#             'user': serialize_doc(user)
#         }), 201

#     except Exception as e:
#         return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

# @app.route('/api/auth/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')

#         if not all([email, password]):
#             return jsonify({'message': 'Email and password are required'}), 400

#         # Find user
#         user = user_model.find_by_email(email)
#         if not user or not check_password_hash(user['password'], password):
#             return jsonify({'message': 'Invalid credentials'}), 401

#         # Create access token
#         access_token = create_access_token(identity=str(user['id']))
        
#         user_data = serialize_doc(user)
#         del user_data['password']

#         return jsonify({
#             'access_token': access_token,
#             'user': user_data
#         }), 200

#     except Exception as e:
#         return jsonify({'message': 'Login failed', 'error': str(e)}), 500

# @app.route('/api/auth/profile', methods=['GET'])
# @jwt_required()
# def get_profile():
#     try:
#         user_id = get_jwt_identity()
#         if not validate_id(user_id):
#             return jsonify({'message': 'Invalid user ID'}), 400
        
#         user = user_model.find_by_id(user_id)
        
#         if not user:
#             return jsonify({'message': 'User not found'}), 404

#         user_data = serialize_doc(user)
#         del user_data['password']
        
#         return jsonify(user_data), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get profile', 'error': str(e)}), 500

# # Villages routes
# @app.route('/api/villages', methods=['GET'])
# @jwt_required()
# def get_villages():
#     try:
#         villages = village_model.get_all_with_stats()
#         return jsonify(serialize_docs(villages)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get villages', 'error': str(e)}), 500

# @app.route('/api/villages', methods=['POST'])
# @jwt_required()
# def create_village():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         code = data.get('code')
#         description = data.get('description', '')

#         if not all([name, code]):
#             return jsonify({'message': 'Name and code are required'}), 400

#         # Check if village code already exists
#         if village_model.code_exists(code):
#             return jsonify({'message': 'Village code already exists'}), 400

#         village_data = {
#             'name': name,
#             'code': code,
#             'description': description
#         }

#         village_id = village_model.create(village_data)
#         if not village_id:
#             return jsonify({'message': 'Failed to create village'}), 500

#         village = village_model.find_by_id(village_id)
#         return jsonify(serialize_doc(village)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create village', 'error': str(e)}), 500

# @app.route('/api/villages/<village_id>', methods=['PUT'])
# @jwt_required()
# def update_village(village_id):
#     try:
#         if not validate_id(village_id):
#             return jsonify({'message': 'Invalid village ID'}), 400
        
#         data = request.get_json()
        
#         update_data = {}
#         if 'name' in data:
#             update_data['name'] = data['name']
#         if 'code' in data:
#             # Check if new code conflicts with existing villages
#             if village_model.code_exists(data['code'], exclude_id=village_id):
#                 return jsonify({'message': 'Village code already exists'}), 400
#             update_data['code'] = data['code']
#         if 'description' in data:
#             update_data['description'] = data['description']

#         if not update_data:
#             return jsonify({'message': 'No data provided for update'}), 400

#         success = village_model.update(village_id, update_data)
#         if not success:
#             return jsonify({'message': 'Village not found or update failed'}), 404

#         village = village_model.find_by_id(village_id)
#         return jsonify(serialize_doc(village)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to update village', 'error': str(e)}), 500

# @app.route('/api/villages/<village_id>', methods=['DELETE'])
# @jwt_required()
# def delete_village(village_id):
#     try:
#         if not validate_id(village_id):
#             return jsonify({'message': 'Invalid village ID'}), 400
        
#         # Check if village has customers
#         customers_count = customer_model.count("village_id = %s", (village_id,))
#         if customers_count > 0:
#             return jsonify({'message': 'Cannot delete village with existing customers'}), 400

#         success = village_model.delete(village_id)
        
#         if not success:
#             return jsonify({'message': 'Village not found'}), 404

#         return jsonify({'message': 'Village deleted successfully'}), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to delete village', 'error': str(e)}), 500

# # Customer routes
# @app.route('/api/customers', methods=['GET'])
# @jwt_required()
# def get_customers():
#     try:
#         village_id = request.args.get('village_id')
        
#         if village_id:
#             if not validate_id(village_id):
#                 return jsonify({'message': 'Invalid village ID'}), 400
#             customers = customer_model.find_by_village(village_id)
#         else:
#             customers = customer_model.find_with_village_info()
        
#         return jsonify(serialize_docs(customers)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get customers', 'error': str(e)}), 500

# @app.route('/api/customers', methods=['POST'])
# @jwt_required()
# def create_customer():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         village_id = data.get('village_id')
#         email = data.get('email')
#         phone = data.get('phone')
#         address = data.get('address', '')

#         if not all([name, village_id]):
#             return jsonify({'message': 'Name and village ID are required'}), 400

#         if not validate_id(village_id):
#             return jsonify({'message': 'Invalid village ID'}), 400

#         if email and not validate_email(email):
#             return jsonify({'message': 'Invalid email format'}), 400

#         if phone and not validate_phone(phone):
#             return jsonify({'message': 'Invalid phone format'}), 400

#         # Check if village exists
#         village = village_model.find_by_id(village_id)
#         if not village:
#             return jsonify({'message': 'Village not found'}), 404

#         customer_data = {
#             'name': name,
#             'village_id': village_id,
#             'email': email,
#             'phone': phone,
#             'address': address
#         }

#         customer_id = customer_model.create(customer_data)
#         if not customer_id:
#             return jsonify({'message': 'Failed to create customer'}), 500

#         customer = customer_model.find_with_village_info(customer_id)
#         return jsonify(serialize_doc(customer)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create customer', 'error': str(e)}), 500

# # Loan routes
# @app.route('/api/loans', methods=['GET'])
# @jwt_required()
# def get_loans():
#     try:
#         customer_id = request.args.get('customer_id')
#         village_id = request.args.get('village_id')
        
#         if customer_id:
#             if not validate_id(customer_id):
#                 return jsonify({'message': 'Invalid customer ID'}), 400
#             loans = loan_model.find_by_customer(customer_id)
#         elif village_id:
#             if not validate_id(village_id):
#                 return jsonify({'message': 'Invalid village ID'}), 400
#             loans = loan_model.find_by_village(village_id)
#         else:
#             loans = loan_model.find_with_customer_info()
        
#         return jsonify(serialize_docs(loans)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get loans', 'error': str(e)}), 500

# @app.route('/api/loans', methods=['POST'])
# @jwt_required()
# def create_loan():
#     try:
#         data = request.get_json()
#         customer_id = data.get('customer_id')
#         village_id = data.get('village_id')
#         principal_amount = data.get('principal_amount')
#         interest_rate = data.get('interest_rate')
#         loan_period_months = data.get('loan_period_months')
#         start_date = data.get('start_date')

#         if not all([customer_id, village_id, principal_amount, interest_rate, loan_period_months, start_date]):
#             return jsonify({'message': 'All loan fields are required'}), 400

#         if not validate_id(customer_id) or not validate_id(village_id):
#             return jsonify({'message': 'Invalid customer or village ID'}), 400

#         try:
#             principal_amount = float(principal_amount)
#             interest_rate = float(interest_rate)
#             loan_period_months = int(loan_period_months)
#         except ValueError:
#             return jsonify({'message': 'Invalid numeric values'}), 400

#         # Validate date format
#         try:
#             start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
#             end_date_obj = start_date_obj.replace(year=start_date_obj.year + (start_date_obj.month + loan_period_months - 1) // 12,
#                                                  month=(start_date_obj.month + loan_period_months - 1) % 12 + 1)
#         except ValueError:
#             return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

#         # Check if customer and village exist
#         customer = customer_model.find_by_id(customer_id)
#         village = village_model.find_by_id(village_id)
        
#         if not customer or not village:
#             return jsonify({'message': 'Customer or village not found'}), 404

#         # Calculate total amount
#         total_amount = calculate_total_amount(principal_amount, interest_rate, loan_period_months)

#         loan_data = {
#             'customer_id': customer_id,
#             'village_id': village_id,
#             'principal_amount': principal_amount,
#             'interest_rate': interest_rate,
#             'loan_period_months': loan_period_months,
#             'total_amount': total_amount,
#             'paid_amount': 0.00,
#             'pending_amount': total_amount,
#             'status': 'active',
#             'start_date': start_date_obj,
#             'end_date': end_date_obj
#         }

#         loan_id = loan_model.create(loan_data)
#         if not loan_id:
#             return jsonify({'message': 'Failed to create loan'}), 500

#         loan = loan_model.find_with_customer_info(loan_id)
#         return jsonify(serialize_doc(loan)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create loan', 'error': str(e)}), 500

# @app.route('/api/loans/<loan_id>', methods=['GET'])
# @jwt_required()
# def get_loan(loan_id):
#     try:
#         if not validate_id(loan_id):
#             return jsonify({'message': 'Invalid loan ID'}), 400
        
#         loan = loan_model.find_with_customer_info(loan_id)
#         if not loan:
#             return jsonify({'message': 'Loan not found'}), 404
        
#         return jsonify(serialize_doc(loan)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get loan', 'error': str(e)}), 500

# @app.route('/api/loans/<loan_id>', methods=['PUT'])
# @jwt_required()
# def update_loan(loan_id):
#     try:
#         if not validate_id(loan_id):
#             return jsonify({'message': 'Invalid loan ID'}), 400
        
#         data = request.get_json()
#         update_data = {}
        
#         # Only allow updating certain fields
#         allowed_fields = ['interest_rate', 'loan_period_months', 'status']
#         for field in allowed_fields:
#             if field in data:
#                 if field in ['interest_rate']:
#                     try:
#                         update_data[field] = float(data[field])
#                     except ValueError:
#                         return jsonify({'message': f'Invalid value for {field}'}), 400
#                 elif field in ['loan_period_months']:
#                     try:
#                         update_data[field] = int(data[field])
#                     except ValueError:
#                         return jsonify({'message': f'Invalid value for {field}'}), 400
#                 else:
#                     update_data[field] = data[field]

#         if not update_data:
#             return jsonify({'message': 'No valid fields provided for update'}), 400

#         # If interest rate or loan period changed, recalculate total amount
#         if 'interest_rate' in update_data or 'loan_period_months' in update_data:
#             loan = loan_model.find_by_id(loan_id)
#             if not loan:
#                 return jsonify({'message': 'Loan not found'}), 404
            
#             new_rate = update_data.get('interest_rate', loan['interest_rate'])
#             new_months = update_data.get('loan_period_months', loan['loan_period_months'])
            
#             new_total = calculate_total_amount(loan['principal_amount'], new_rate, new_months)
#             update_data['total_amount'] = new_total
#             update_data['pending_amount'] = new_total - loan['paid_amount']

#         success = loan_model.update(loan_id, update_data)
#         if not success:
#             return jsonify({'message': 'Loan not found or update failed'}), 404

#         loan = loan_model.find_with_customer_info(loan_id)
#         return jsonify(serialize_doc(loan)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to update loan', 'error': str(e)}), 500

# # Payment routes
# @app.route('/api/payments', methods=['GET'])
# @jwt_required()
# def get_payments():
#     try:
#         loan_id = request.args.get('loan_id')
#         customer_id = request.args.get('customer_id')
        
#         if loan_id:
#             if not validate_id(loan_id):
#                 return jsonify({'message': 'Invalid loan ID'}), 400
#             payments = payment_model.find_by_loan(loan_id)
#         elif customer_id:
#             if not validate_id(customer_id):
#                 return jsonify({'message': 'Invalid customer ID'}), 400
#             payments = payment_model.find_by_customer(customer_id)
#         else:
#             payments = payment_model.find_with_loan_info()
        
#         return jsonify(serialize_docs(payments)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get payments', 'error': str(e)}), 500

# @app.route('/api/payments', methods=['POST'])
# @jwt_required()
# def create_payment():
#     try:
#         data = request.get_json()
#         loan_id = data.get('loan_id')
#         customer_id = data.get('customer_id')
#         amount = data.get('amount')
#         payment_date = data.get('payment_date')
#         payment_method = data.get('payment_method', 'cash')
#         reference_number = data.get('reference_number', '')
#         notes = data.get('notes', '')

#         if not all([loan_id, customer_id, amount, payment_date]):
#             return jsonify({'message': 'Loan ID, customer ID, amount, and payment date are required'}), 400

#         if not validate_id(loan_id) or not validate_id(customer_id):
#             return jsonify({'message': 'Invalid loan or customer ID'}), 400

#         try:
#             amount = float(amount)
#             if amount <= 0:
#                 return jsonify({'message': 'Amount must be positive'}), 400
#         except ValueError:
#             return jsonify({'message': 'Invalid amount'}), 400

#         # Validate date format
#         try:
#             payment_date_obj = datetime.strptime(payment_date, '%Y-%m-%d').date()
#         except ValueError:
#             return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

#         # Check if loan exists and get details
#         loan = loan_model.find_by_id(loan_id)
#         if not loan:
#             return jsonify({'message': 'Loan not found'}), 404

#         # Check if payment amount doesn't exceed pending amount
#         if amount > loan['pending_amount']:
#             return jsonify({'message': 'Payment amount exceeds pending amount'}), 400

#         # Verify customer owns the loan
#         if str(loan['customer_id']) != str(customer_id):
#             return jsonify({'message': 'Customer does not match loan'}), 400

#         payment_data = {
#             'loan_id': loan_id,
#             'customer_id': customer_id,
#             'amount': amount,
#             'payment_date': payment_date_obj,
#             'payment_method': payment_method,
#             'reference_number': reference_number,
#             'notes': notes
#         }

#         payment_id = payment_model.create(payment_data)
#         if not payment_id:
#             return jsonify({'message': 'Failed to create payment'}), 500

#         # Update loan paid amount
#         success = loan_model.update_paid_amount(loan_id, amount)
#         if not success:
#             return jsonify({'message': 'Payment created but failed to update loan'}), 500

#         payment = payment_model.find_with_loan_info(payment_id)
#         return jsonify(serialize_doc(payment)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create payment', 'error': str(e)}), 500

# # Dashboard routes
# @app.route('/api/dashboard/stats', methods=['GET'])
# @jwt_required()
# def get_dashboard_stats():
#     try:
#         total_villages = village_model.count()
#         total_customers = customer_model.count()
#         total_loans = loan_model.count()
        
#         # Get loan statistics
#         from utils import get_db_cursor
        
#         with get_db_cursor() as cursor:
#             if cursor:
#                 cursor.execute("""
#                     SELECT 
#                         COALESCE(SUM(total_amount), 0) as total_amount,
#                         COALESCE(SUM(paid_amount), 0) as total_paid,
#                         COALESCE(SUM(pending_amount), 0) as total_pending
#                     FROM loans
#                 """)
#                 amounts = cursor.fetchone()
#             else:
#                 amounts = {'total_amount': 0, 'total_paid': 0, 'total_pending': 0}

#         stats = {
#             'total_villages': total_villages,
#             'total_customers': total_customers,
#             'total_loans': total_loans,
#             'total_amount': float(amounts['total_amount']),
#             'total_paid': float(amounts['total_paid']),
#             'total_pending': float(amounts['total_pending'])
#         }

#         return jsonify(stats), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get dashboard stats', 'error': str(e)}), 500

# # Health check route
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     try:
#         # Test database connection
#         from utils import get_db_connection
#         connection = get_db_connection()
#         if connection:
#             connection.close()
#             db_status = 'connected'
#         else:
#             db_status = 'disconnected'
        
#         return jsonify({
#             'status': 'healthy',
#             'database': db_status,
#             'timestamp': datetime.utcnow().isoformat()
#         }), 200
#     except Exception as e:
#         return jsonify({
#             'status': 'unhealthy',
#             'error': str(e),
#             'timestamp': datetime.utcnow().isoformat()
#         }), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# from werkzeug.security import generate_password_hash, check_password_hash
# from datetime import datetime, timedelta
# import os
# from functools import wraps

# # Import our models and utilities
# from models import UserModel, VillageModel, CustomerModel, LoanModel, PaymentModel
# from utils import serialize_doc, serialize_docs, validate_email, validate_phone, validate_id, calculate_total_amount

# # Initialize Flask app
# app = Flask(__name__)
# app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# # Initialize extensions
# jwt = JWTManager(app)
# CORS(app)

# # Initialize models
# user_model = UserModel()
# village_model = VillageModel()
# customer_model = CustomerModel()
# loan_model = LoanModel()
# payment_model = PaymentModel()

# # Error handlers
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({'error': 'Not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     return jsonify({'error': 'Internal server error'}), 500

# # Auth routes
# @app.route('/api/auth/register', methods=['POST'])
# def register():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         email = data.get('email')
#         password = data.get('password')

#         if not all([name, email, password]):
#             return jsonify({'message': 'All fields are required'}), 400

#         if not validate_email(email):
#             return jsonify({'message': 'Invalid email format'}), 400

#         # Check if user already exists
#         if user_model.find_by_email(email):
#             return jsonify({'message': 'User already exists'}), 400

#         # Create new user
#         hashed_password = generate_password_hash(password)
#         user_data = {
#             'name': name,
#             'email': email,
#             'password': hashed_password,
#             'role': 'user'
#         }
        
#         user_id = user_model.create(user_data)
#         if not user_id:
#             return jsonify({'message': 'Failed to create user'}), 500
        
#         # Get created user (without password)
#         user = user_model.find_by_id(user_id)
#         del user['password']

#         # Create access token
#         access_token = create_access_token(identity=str(user_id))

#         return jsonify({
#             'access_token': access_token,
#             'user': serialize_doc(user)
#         }), 201

#     except Exception as e:
#         return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

# @app.route('/api/auth/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')

#         if not all([email, password]):
#             return jsonify({'message': 'Email and password are required'}), 400

#         # Find user
#         user = user_model.find_by_email(email)
#         if not user or not check_password_hash(user['password'], password):
#             return jsonify({'message': 'Invalid credentials'}), 401

#         # Create access token
#         access_token = create_access_token(identity=str(user['id']))
        
#         user_data = serialize_doc(user)
#         del user_data['password']

#         return jsonify({
#             'access_token': access_token,
#             'user': user_data
#         }), 200

#     except Exception as e:
#         return jsonify({'message': 'Login failed', 'error': str(e)}), 500

# @app.route('/api/auth/profile', methods=['GET'])
# @jwt_required()
# def get_profile():
#     try:
#         user_id = get_jwt_identity()
#         if not validate_id(user_id):
#             return jsonify({'message': 'Invalid user ID'}), 400
        
#         user = user_model.find_by_id(user_id)
        
#         if not user:
#             return jsonify({'message': 'User not found'}), 404

#         user_data = serialize_doc(user)
#         del user_data['password']
        
#         return jsonify(user_data), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get profile', 'error': str(e)}), 500

# # Villages routes
# @app.route('/api/villages', methods=['GET'])
# @jwt_required()
# def get_villages():
#     try:
#         villages = village_model.get_all_with_stats()
#         return jsonify(serialize_docs(villages)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get villages', 'error': str(e)}), 500

# @app.route('/api/villages', methods=['POST'])
# @jwt_required()
# def create_village():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         code = data.get('code')
#         description = data.get('description', '')

#         if not all([name, code]):
#             return jsonify({'message': 'Name and code are required'}), 400

#         # Check if village code already exists
#         if village_model.code_exists(code):
#             return jsonify({'message': 'Village code already exists'}), 400

#         village_data = {
#             'name': name,
#             'code': code,
#             'description': description
#         }

#         village_id = village_model.create(village_data)
#         if not village_id:
#             return jsonify({'message': 'Failed to create village'}), 500

#         village = village_model.find_by_id(village_id)
#         return jsonify(serialize_doc(village)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create village', 'error': str(e)}), 500

# @app.route('/api/villages/<village_id>', methods=['PUT'])
# @jwt_required()
# def update_village(village_id):
#     try:
#         if not validate_id(village_id):
#             return jsonify({'message': 'Invalid village ID format'}), 400
        
#         data = request.get_json()
        
#         update_data = {}
#         if 'name' in data:
#             update_data['name'] = data['name']
#         if 'code' in data:
#             # Check if new code conflicts with existing villages
#             if village_model.code_exists(data['code'], exclude_id=village_id):
#                 return jsonify({'message': 'Village code already exists'}), 400
#             update_data['code'] = data['code']
#         if 'description' in data:
#             update_data['description'] = data['description']

#         if not update_data:
#             return jsonify({'message': 'No data provided for update'}), 400

#         success = village_model.update(village_id, update_data)
#         if not success:
#             return jsonify({'message': 'Village not found or update failed'}), 404

#         village = village_model.find_by_id(village_id)
#         return jsonify(serialize_doc(village)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to update village', 'error': str(e)}), 500

# @app.route('/api/villages/<village_id>', methods=['DELETE'])
# @jwt_required()
# def delete_village(village_id):
#     try:
#         if not validate_id(village_id):
#             return jsonify({'message': 'Invalid village ID format'}), 400
        
#         # Check if village exists first
#         village = village_model.find_by_id(village_id)
#         if not village:
#             return jsonify({'message': 'Village not found'}), 404
        
#         # Check if village has customers
#         customers_count = customer_model.count("village_id = ?", (village_id,))
#         if customers_count > 0:
#             return jsonify({'message': 'Cannot delete village with existing customers'}), 400

#         success = village_model.delete(village_id)
        
#         if not success:
#             return jsonify({'message': 'Failed to delete village'}), 500

#         return jsonify({'message': 'Village deleted successfully'}), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to delete village', 'error': str(e)}), 500

# # Customer routes
# @app.route('/api/customers', methods=['GET'])
# @jwt_required()
# def get_customers():
#     try:
#         village_id = request.args.get('village_id')
        
#         if village_id:
#             if not validate_id(village_id):
#                 return jsonify({'message': 'Invalid village ID format'}), 400
#             customers = customer_model.find_by_village(village_id)
#         else:
#             customers = customer_model.find_with_village_info()
        
#         return jsonify(serialize_docs(customers)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get customers', 'error': str(e)}), 500

# @app.route('/api/customers', methods=['POST'])
# @jwt_required()
# def create_customer():
#     try:
#         data = request.get_json()
#         name = data.get('name')
#         village_id = data.get('village_id')
#         email = data.get('email')
#         phone = data.get('phone')
#         address = data.get('address', '')

#         if not all([name, village_id]):
#             return jsonify({'message': 'Name and village ID are required'}), 400

#         if not validate_id(village_id):
#             return jsonify({'message': 'Invalid village ID format'}), 400

#         if email and not validate_email(email):
#             return jsonify({'message': 'Invalid email format'}), 400

#         if phone and not validate_phone(phone):
#             return jsonify({'message': 'Invalid phone format'}), 400

#         # Check if village exists
#         village = village_model.find_by_id(village_id)
#         if not village:
#             return jsonify({'message': 'Village not found'}), 404

#         customer_data = {
#             'name': name,
#             'village_id': village_id,
#             'email': email,
#             'phone': phone,
#             'address': address
#         }

#         customer_id = customer_model.create(customer_data)
#         if not customer_id:
#             return jsonify({'message': 'Failed to create customer'}), 500

#         customer = customer_model.find_with_village_info(customer_id)
#         return jsonify(serialize_doc(customer)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create customer', 'error': str(e)}), 500

# # Loan routes
# @app.route('/api/loans', methods=['GET'])
# @jwt_required()
# def get_loans():
#     try:
#         customer_id = request.args.get('customer_id')
#         village_id = request.args.get('village_id')
        
#         if customer_id:
#             if not validate_id(customer_id):
#                 return jsonify({'message': 'Invalid customer ID format'}), 400
#             loans = loan_model.find_by_customer(customer_id)
#         elif village_id:
#             if not validate_id(village_id):
#                 return jsonify({'message': 'Invalid village ID format'}), 400
#             loans = loan_model.find_by_village(village_id)
#         else:
#             loans = loan_model.find_with_customer_info()
        
#         return jsonify(serialize_docs(loans)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get loans', 'error': str(e)}), 500

# @app.route('/api/loans', methods=['POST'])
# @jwt_required()
# def create_loan():
#     try:
#         data = request.get_json()
#         customer_id = data.get('customer_id')
#         village_id = data.get('village_id')
#         principal_amount = data.get('principal_amount')
#         interest_rate = data.get('interest_rate')
#         loan_period_months = data.get('loan_period_months')
#         start_date = data.get('start_date')

#         if not all([customer_id, village_id, principal_amount, interest_rate, loan_period_months, start_date]):
#             return jsonify({'message': 'All loan fields are required'}), 400

#         if not validate_id(customer_id) or not validate_id(village_id):
#             return jsonify({'message': 'Invalid customer or village ID format'}), 400

#         try:
#             principal_amount = float(principal_amount)
#             interest_rate = float(interest_rate)
#             loan_period_months = int(loan_period_months)
#         except ValueError:
#             return jsonify({'message': 'Invalid numeric values'}), 400

#         # Validate date format
#         try:
#             start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
#             end_date_obj = start_date_obj.replace(year=start_date_obj.year + (start_date_obj.month + loan_period_months - 1) // 12,
#                                                  month=(start_date_obj.month + loan_period_months - 1) % 12 + 1)
#         except ValueError:
#             return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

#         # Check if customer and village exist
#         customer = customer_model.find_by_id(customer_id)
#         village = village_model.find_by_id(village_id)
        
#         if not customer or not village:
#             return jsonify({'message': 'Customer or village not found'}), 404

#         # Calculate total amount
#         total_amount = calculate_total_amount(principal_amount, interest_rate, loan_period_months)

#         loan_data = {
#             'customer_id': customer_id,
#             'village_id': village_id,
#             'principal_amount': principal_amount,
#             'interest_rate': interest_rate,
#             'loan_period_months': loan_period_months,
#             'total_amount': total_amount,
#             'paid_amount': 0.00,
#             'pending_amount': total_amount,
#             'status': 'active',
#             'start_date': start_date_obj,
#             'end_date': end_date_obj
#         }

#         loan_id = loan_model.create(loan_data)
#         if not loan_id:
#             return jsonify({'message': 'Failed to create loan'}), 500

#         loan = loan_model.find_with_customer_info(loan_id)
#         return jsonify(serialize_doc(loan)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create loan', 'error': str(e)}), 500

# @app.route('/api/loans/<loan_id>', methods=['GET'])
# @jwt_required()
# def get_loan(loan_id):
#     try:
#         if not validate_id(loan_id):
#             return jsonify({'message': 'Invalid loan ID format'}), 400
        
#         loan = loan_model.find_with_customer_info(loan_id)
#         if not loan:
#             return jsonify({'message': 'Loan not found'}), 404
        
#         return jsonify(serialize_doc(loan)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get loan', 'error': str(e)}), 500

# @app.route('/api/loans/<loan_id>', methods=['PUT'])
# @jwt_required()
# def update_loan(loan_id):
#     try:
#         if not validate_id(loan_id):
#             return jsonify({'message': 'Invalid loan ID format'}), 400
        
#         data = request.get_json()
#         update_data = {}
        
#         # Only allow updating certain fields
#         allowed_fields = ['interest_rate', 'loan_period_months', 'status']
#         for field in allowed_fields:
#             if field in data:
#                 if field in ['interest_rate']:
#                     try:
#                         update_data[field] = float(data[field])
#                     except ValueError:
#                         return jsonify({'message': f'Invalid value for {field}'}), 400
#                 elif field in ['loan_period_months']:
#                     try:
#                         update_data[field] = int(data[field])
#                     except ValueError:
#                         return jsonify({'message': f'Invalid value for {field}'}), 400
#                 else:
#                     update_data[field] = data[field]

#         if not update_data:
#             return jsonify({'message': 'No valid fields provided for update'}), 400

#         # If interest rate or loan period changed, recalculate total amount
#         if 'interest_rate' in update_data or 'loan_period_months' in update_data:
#             loan = loan_model.find_by_id(loan_id)
#             if not loan:
#                 return jsonify({'message': 'Loan not found'}), 404
            
#             new_rate = update_data.get('interest_rate', loan['interest_rate'])
#             new_months = update_data.get('loan_period_months', loan['loan_period_months'])
            
#             new_total = calculate_total_amount(loan['principal_amount'], new_rate, new_months)
#             update_data['total_amount'] = new_total
#             update_data['pending_amount'] = new_total - loan['paid_amount']

#         success = loan_model.update(loan_id, update_data)
#         if not success:
#             return jsonify({'message': 'Loan not found or update failed'}), 404

#         loan = loan_model.find_with_customer_info(loan_id)
#         return jsonify(serialize_doc(loan)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to update loan', 'error': str(e)}), 500

# # Payment routes
# @app.route('/api/payments', methods=['GET'])
# @jwt_required()
# def get_payments():
#     try:
#         loan_id = request.args.get('loan_id')
#         customer_id = request.args.get('customer_id')
        
#         if loan_id:
#             if not validate_id(loan_id):
#                 return jsonify({'message': 'Invalid loan ID format'}), 400
#             payments = payment_model.find_by_loan(loan_id)
#         elif customer_id:
#             if not validate_id(customer_id):
#                 return jsonify({'message': 'Invalid customer ID format'}), 400
#             payments = payment_model.find_by_customer(customer_id)
#         else:
#             payments = payment_model.find_with_loan_info()
        
#         return jsonify(serialize_docs(payments)), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get payments', 'error': str(e)}), 500

# @app.route('/api/payments', methods=['POST'])
# @jwt_required()
# def create_payment():
#     try:
#         data = request.get_json()
#         loan_id = data.get('loan_id')
#         customer_id = data.get('customer_id')
#         amount = data.get('amount')
#         payment_date = data.get('payment_date')
#         payment_method = data.get('payment_method', 'cash')
#         reference_number = data.get('reference_number', '')
#         notes = data.get('notes', '')

#         if not all([loan_id, customer_id, amount, payment_date]):
#             return jsonify({'message': 'Loan ID, customer ID, amount, and payment date are required'}), 400

#         if not validate_id(loan_id) or not validate_id(customer_id):
#             return jsonify({'message': 'Invalid loan or customer ID format'}), 400

#         try:
#             amount = float(amount)
#             if amount <= 0:
#                 return jsonify({'message': 'Amount must be positive'}), 400
#         except ValueError:
#             return jsonify({'message': 'Invalid amount'}), 400

#         # Validate date format
#         try:
#             payment_date_obj = datetime.strptime(payment_date, '%Y-%m-%d').date()
#         except ValueError:
#             return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

#         # Check if loan exists and get details
#         loan = loan_model.find_by_id(loan_id)
#         if not loan:
#             return jsonify({'message': 'Loan not found'}), 404

#         # Check if payment amount doesn't exceed pending amount
#         if amount > loan['pending_amount']:
#             return jsonify({'message': 'Payment amount exceeds pending amount'}), 400

#         # Verify customer owns the loan
#         if str(loan['customer_id']) != str(customer_id):
#             return jsonify({'message': 'Customer does not match loan'}), 400

#         payment_data = {
#             'loan_id': loan_id,
#             'customer_id': customer_id,
#             'amount': amount,
#             'payment_date': payment_date_obj,
#             'payment_method': payment_method,
#             'reference_number': reference_number,
#             'notes': notes
#         }

#         payment_id = payment_model.create(payment_data)
#         if not payment_id:
#             return jsonify({'message': 'Failed to create payment'}), 500

#         # Update loan paid amount
#         success = loan_model.update_paid_amount(loan_id, amount)
#         if not success:
#             return jsonify({'message': 'Payment created but failed to update loan'}), 500

#         payment = payment_model.find_with_loan_info(payment_id)
#         return jsonify(serialize_doc(payment)), 201

#     except Exception as e:
#         return jsonify({'message': 'Failed to create payment', 'error': str(e)}), 500

# # Dashboard routes
# @app.route('/api/dashboard/stats', methods=['GET'])
# @jwt_required()
# def get_dashboard_stats():
#     try:
#         total_villages = village_model.count()
#         total_customers = customer_model.count()
#         total_loans = loan_model.count()
        
#         # Get loan statistics
#         connection = village_model.db.get_connection()
#         if connection:
#             cursor = connection.cursor()
#             cursor.execute("""
#                 SELECT 
#                     COALESCE(SUM(total_amount), 0) as total_amount,
#                     COALESCE(SUM(paid_amount), 0) as total_paid,
#                     COALESCE(SUM(pending_amount), 0) as total_pending
#                 FROM loans
#             """)
#             result = cursor.fetchone()
#             if result:
#                 amounts = {
#                     'total_amount': float(result[0]),
#                     'total_paid': float(result[1]),
#                     'total_pending': float(result[2])
#                 }
#             else:
#                 amounts = {'total_amount': 0, 'total_paid': 0, 'total_pending': 0}
#             connection.close()
#         else:
#             amounts = {'total_amount': 0, 'total_paid': 0, 'total_pending': 0}

#         stats = {
#             'total_villages': total_villages,
#             'total_customers': total_customers,
#             'total_loans': total_loans,
#             'total_amount': amounts['total_amount'],
#             'total_paid': amounts['total_paid'],
#             'total_pending': amounts['total_pending']
#         }

#         return jsonify(stats), 200

#     except Exception as e:
#         return jsonify({'message': 'Failed to get dashboard stats', 'error': str(e)}), 500

# # Health check route
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     try:
#         # Test database connection
#         connection = village_model.db.get_connection()
#         if connection:
#             connection.close()
#             db_status = 'connected'
#         else:
#             db_status = 'disconnected'
        
#         return jsonify({
#             'status': 'healthy',
#             'database': db_status,
#             'timestamp': datetime.utcnow().isoformat()
#         }), 200
#     except Exception as e:
#         return jsonify({
#             'status': 'unhealthy',
#             'error': str(e),
#             'timestamp': datetime.utcnow().isoformat()
#         }), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from functools import wraps

# Import our models and utilities
from models import UserModel, VillageModel, CustomerModel, LoanModel, PaymentModel
from utils import serialize_doc, serialize_docs, validate_email, validate_phone, validate_id, calculate_total_amount

# Initialize Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize extensions
jwt = JWTManager(app)
CORS(app)

# Initialize models
user_model = UserModel()
village_model = VillageModel()
customer_model = CustomerModel()
loan_model = LoanModel()
payment_model = PaymentModel()

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not all([name, email, password]):
            return jsonify({'message': 'All fields are required'}), 400

        if not validate_email(email):
            return jsonify({'message': 'Invalid email format'}), 400

        # Check if user already exists
        if user_model.find_by_email(email):
            return jsonify({'message': 'User already exists'}), 400

        # Create new user
        hashed_password = generate_password_hash(password)
        user_data = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'role': 'user'
        }
        
        user_id = user_model.create(user_data)
        if not user_id:
            return jsonify({'message': 'Failed to create user'}), 500
        
        # Get created user (without password)
        user = user_model.find_by_id(user_id)
        del user['password']

        # Create access token
        access_token = create_access_token(identity=str(user_id))

        return jsonify({
            'access_token': access_token,
            'user': serialize_doc(user)
        }), 201

    except Exception as e:
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'message': 'Email and password are required'}), 400

        # Find user
        user = user_model.find_by_email(email)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 401

        # Create access token
        access_token = create_access_token(identity=str(user['id']))
        
        user_data = serialize_doc(user)
        del user_data['password']

        return jsonify({
            'access_token': access_token,
            'user': user_data
        }), 200

    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        if not validate_id(user_id):
            return jsonify({'message': 'Invalid user ID'}), 400
        
        user = user_model.find_by_id(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404

        user_data = serialize_doc(user)
        del user_data['password']
        
        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get profile', 'error': str(e)}), 500

# Villages routes
@app.route('/api/villages', methods=['GET'])
@jwt_required()
def get_villages():
    try:
        villages = village_model.get_all_with_stats()
        return jsonify(serialize_docs(villages)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get villages', 'error': str(e)}), 500

@app.route('/api/villages', methods=['POST'])
@jwt_required()
def create_village():
    try:
        data = request.get_json()
        name = data.get('name')
        code = data.get('code')
        description = data.get('description', '')

        if not all([name, code]):
            return jsonify({'message': 'Name and code are required'}), 400

        # Check if village code already exists
        if village_model.code_exists(code):
            return jsonify({'message': 'Village code already exists'}), 400

        village_data = {
            'name': name,
            'code': code,
            'description': description
        }

        village_id = village_model.create(village_data)
        if not village_id:
            return jsonify({'message': 'Failed to create village'}), 500

        village = village_model.find_by_id(village_id)
        return jsonify(serialize_doc(village)), 201

    except Exception as e:
        return jsonify({'message': 'Failed to create village', 'error': str(e)}), 500

@app.route('/api/villages/<village_id>', methods=['PUT'])
@jwt_required()
def update_village(village_id):
    try:
        if not validate_id(village_id):
            return jsonify({'message': 'Invalid village ID format'}), 400
        
        data = request.get_json()
        
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'code' in data:
            # Check if new code conflicts with existing villages
            if village_model.code_exists(data['code'], exclude_id=village_id):
                return jsonify({'message': 'Village code already exists'}), 400
            update_data['code'] = data['code']
        if 'description' in data:
            update_data['description'] = data['description']

        if not update_data:
            return jsonify({'message': 'No data provided for update'}), 400

        success = village_model.update(village_id, update_data)
        if not success:
            return jsonify({'message': 'Village not found or update failed'}), 404

        village = village_model.find_by_id(village_id)
        return jsonify(serialize_doc(village)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to update village', 'error': str(e)}), 500

@app.route('/api/villages/<village_id>', methods=['DELETE'])
@jwt_required()
def delete_village(village_id):
    try:
        if not validate_id(village_id):
            return jsonify({'message': 'Invalid village ID format'}), 400
        
        # Check if village exists first
        village = village_model.find_by_id(village_id)
        if not village:
            return jsonify({'message': 'Village not found'}), 404
        
        # Check if village has customers
        customers_count = customer_model.count("village_id = ?", (village_id,))
        if customers_count > 0:
            return jsonify({'message': 'Cannot delete village with existing customers'}), 400

        success = village_model.delete(village_id)
        
        if not success:
            return jsonify({'message': 'Failed to delete village'}), 500

        return jsonify({'message': 'Village deleted successfully'}), 200

    except Exception as e:
        return jsonify({'message': 'Failed to delete village', 'error': str(e)}), 500

# Customer routes
@app.route('/api/customers', methods=['GET'])
@jwt_required()
def get_customers():
    try:
        village_id = request.args.get('village_id')
        
        if village_id:
            if not validate_id(village_id):
                return jsonify({'message': 'Invalid village ID format'}), 400
            customers = customer_model.find_by_village(village_id)
        else:
            customers = customer_model.find_with_village_info()
        
        return jsonify(serialize_docs(customers)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get customers', 'error': str(e)}), 500

@app.route('/api/customers', methods=['POST'])
@jwt_required()
def create_customer():
    try:
        data = request.get_json()
        name = data.get('name')
        village_id = data.get('village_id')
        email = data.get('email')
        phone = data.get('phone')
        address = data.get('address', '')

        if not all([name, village_id]):
            return jsonify({'message': 'Name and village ID are required'}), 400

        if not validate_id(village_id):
            return jsonify({'message': 'Invalid village ID format'}), 400

        if email and not validate_email(email):
            return jsonify({'message': 'Invalid email format'}), 400

        if phone and not validate_phone(phone):
            return jsonify({'message': 'Invalid phone format'}), 400

        # Check if village exists
        village = village_model.find_by_id(village_id)
        if not village:
            return jsonify({'message': 'Village not found'}), 404

        customer_data = {
            'name': name,
            'village_id': village_id,
            'email': email,
            'phone': phone,
            'address': address
        }

        customer_id = customer_model.create(customer_data)
        if not customer_id:
            return jsonify({'message': 'Failed to create customer'}), 500

        customer = customer_model.find_with_village_info(customer_id)
        return jsonify(serialize_doc(customer)), 201

    except Exception as e:
        return jsonify({'message': 'Failed to create customer', 'error': str(e)}), 500

@app.route('/api/customers/<customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    try:
        if not validate_id(customer_id):
            return jsonify({'message': 'Invalid customer ID format'}), 400
        
        customer = customer_model.find_with_village_info(customer_id)
        if not customer:
            return jsonify({'message': 'Customer not found'}), 404
        
        return jsonify(serialize_doc(customer)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get customer', 'error': str(e)}), 500

@app.route('/api/customers/<customer_id>', methods=['PUT'])
@jwt_required()
def update_customer(customer_id):
    try:
        if not validate_id(customer_id):
            return jsonify({'message': 'Invalid customer ID format'}), 400
        
        data = request.get_json()
        
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'village_id' in data:
            if not validate_id(data['village_id']):
                return jsonify({'message': 'Invalid village ID format'}), 400
            # Check if village exists
            village = village_model.find_by_id(data['village_id'])
            if not village:
                return jsonify({'message': 'Village not found'}), 404
            update_data['village_id'] = data['village_id']
        if 'email' in data:
            if data['email'] and not validate_email(data['email']):
                return jsonify({'message': 'Invalid email format'}), 400
            update_data['email'] = data['email']
        if 'phone' in data:
            if data['phone'] and not validate_phone(data['phone']):
                return jsonify({'message': 'Invalid phone format'}), 400
            update_data['phone'] = data['phone']
        if 'address' in data:
            update_data['address'] = data['address']

        if not update_data:
            return jsonify({'message': 'No data provided for update'}), 400

        success = customer_model.update(customer_id, update_data)
        if not success:
            return jsonify({'message': 'Customer not found or update failed'}), 404

        customer = customer_model.find_with_village_info(customer_id)
        return jsonify(serialize_doc(customer)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to update customer', 'error': str(e)}), 500

@app.route('/api/customers/<customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id):
    try:
        if not validate_id(customer_id):
            return jsonify({'message': 'Invalid customer ID format'}), 400
        
        # Check if customer exists first
        customer = customer_model.find_by_id(customer_id)
        if not customer:
            return jsonify({'message': 'Customer not found'}), 404
        
        # Check if customer has loans
        loans_count = loan_model.count("customer_id = ?", (customer_id,))
        if loans_count > 0:
            return jsonify({'message': 'Cannot delete customer with existing loans'}), 400

        success = customer_model.delete(customer_id)
        
        if not success:
            return jsonify({'message': 'Failed to delete customer'}), 500

        return jsonify({'message': 'Customer deleted successfully'}), 200

    except Exception as e:
        return jsonify({'message': 'Failed to delete customer', 'error': str(e)}), 500

# Loan routes
@app.route('/api/loans', methods=['GET'])
@jwt_required()
def get_loans():
    try:
        customer_id = request.args.get('customer_id')
        village_id = request.args.get('village_id')
        
        if customer_id:
            if not validate_id(customer_id):
                return jsonify({'message': 'Invalid customer ID format'}), 400
            loans = loan_model.find_by_customer(customer_id)
        elif village_id:
            if not validate_id(village_id):
                return jsonify({'message': 'Invalid village ID format'}), 400
            loans = loan_model.find_by_village(village_id)
        else:
            loans = loan_model.find_with_customer_info()
        
        return jsonify(serialize_docs(loans)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get loans', 'error': str(e)}), 500

@app.route('/api/loans', methods=['POST'])
@jwt_required()
def create_loan():
    try:
        data = request.get_json()
        customer_id = data.get('customer_id')
        village_id = data.get('village_id')
        principal_amount = data.get('principal_amount')
        interest_rate = data.get('interest_rate')
        loan_period_months = data.get('loan_period_months')
        start_date = data.get('start_date')

        if not all([customer_id, village_id, principal_amount, interest_rate, loan_period_months, start_date]):
            return jsonify({'message': 'All loan fields are required'}), 400

        if not validate_id(customer_id) or not validate_id(village_id):
            return jsonify({'message': 'Invalid customer or village ID format'}), 400

        try:
            principal_amount = float(principal_amount)
            interest_rate = float(interest_rate)
            loan_period_months = int(loan_period_months)
        except ValueError:
            return jsonify({'message': 'Invalid numeric values'}), 400

        # Validate date format
        try:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date_obj = start_date_obj.replace(year=start_date_obj.year + (start_date_obj.month + loan_period_months - 1) // 12,
                                                 month=(start_date_obj.month + loan_period_months - 1) % 12 + 1)
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

        # Check if customer and village exist
        customer = customer_model.find_by_id(customer_id)
        village = village_model.find_by_id(village_id)
        
        if not customer or not village:
            return jsonify({'message': 'Customer or village not found'}), 404

        # Calculate total amount
        total_amount = calculate_total_amount(principal_amount, interest_rate, loan_period_months)

        loan_data = {
            'customer_id': customer_id,
            'village_id': village_id,
            'principal_amount': principal_amount,
            'interest_rate': interest_rate,
            'loan_period_months': loan_period_months,
            'total_amount': total_amount,
            'paid_amount': 0.00,
            'pending_amount': total_amount,
            'status': 'active',
            'start_date': start_date_obj,
            'end_date': end_date_obj
        }

        loan_id = loan_model.create(loan_data)
        if not loan_id:
            return jsonify({'message': 'Failed to create loan'}), 500

        loan = loan_model.find_with_customer_info(loan_id)
        return jsonify(serialize_doc(loan)), 201

    except Exception as e:
        return jsonify({'message': 'Failed to create loan', 'error': str(e)}), 500

@app.route('/api/loans/<loan_id>', methods=['GET'])
@jwt_required()
def get_loan(loan_id):
    try:
        if not validate_id(loan_id):
            return jsonify({'message': 'Invalid loan ID format'}), 400
        
        loan = loan_model.find_with_customer_info(loan_id)
        if not loan:
            return jsonify({'message': 'Loan not found'}), 404
        
        return jsonify(serialize_doc(loan)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get loan', 'error': str(e)}), 500

@app.route('/api/loans/<loan_id>', methods=['PUT'])
@jwt_required()
def update_loan(loan_id):
    try:
        if not validate_id(loan_id):
            return jsonify({'message': 'Invalid loan ID format'}), 400
        
        data = request.get_json()
        update_data = {}
        
        # Only allow updating certain fields
        allowed_fields = ['interest_rate', 'loan_period_months', 'status']
        for field in allowed_fields:
            if field in data:
                if field in ['interest_rate']:
                    try:
                        update_data[field] = float(data[field])
                    except ValueError:
                        return jsonify({'message': f'Invalid value for {field}'}), 400
                elif field in ['loan_period_months']:
                    try:
                        update_data[field] = int(data[field])
                    except ValueError:
                        return jsonify({'message': f'Invalid value for {field}'}), 400
                else:
                    update_data[field] = data[field]

        if not update_data:
            return jsonify({'message': 'No valid fields provided for update'}), 400

        # If interest rate or loan period changed, recalculate total amount
        if 'interest_rate' in update_data or 'loan_period_months' in update_data:
            loan = loan_model.find_by_id(loan_id)
            if not loan:
                return jsonify({'message': 'Loan not found'}), 404
            
            new_rate = update_data.get('interest_rate', loan['interest_rate'])
            new_months = update_data.get('loan_period_months', loan['loan_period_months'])
            
            new_total = calculate_total_amount(loan['principal_amount'], new_rate, new_months)
            update_data['total_amount'] = new_total
            update_data['pending_amount'] = new_total - loan['paid_amount']

        success = loan_model.update(loan_id, update_data)
        if not success:
            return jsonify({'message': 'Loan not found or update failed'}), 404

        loan = loan_model.find_with_customer_info(loan_id)
        return jsonify(serialize_doc(loan)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to update loan', 'error': str(e)}), 500

@app.route('/api/loans/<loan_id>', methods=['DELETE'])
@jwt_required()
def delete_loan(loan_id):
    try:
        if not validate_id(loan_id):
            return jsonify({'message': 'Invalid loan ID format'}), 400
        
        # Check if loan exists first
        loan = loan_model.find_by_id(loan_id)
        if not loan:
            return jsonify({'message': 'Loan not found'}), 404
        
        # Check if loan has payments
        payments_count = payment_model.count("loan_id = ?", (loan_id,))
        if payments_count > 0:
            return jsonify({'message': 'Cannot delete loan with existing payments'}), 400

        success = loan_model.delete(loan_id)
        
        if not success:
            return jsonify({'message': 'Failed to delete loan'}), 500

        return jsonify({'message': 'Loan deleted successfully'}), 200

    except Exception as e:
        return jsonify({'message': 'Failed to delete loan', 'error': str(e)}), 500

# Payment routes
@app.route('/api/payments', methods=['GET'])
@jwt_required()
def get_payments():
    try:
        loan_id = request.args.get('loan_id')
        customer_id = request.args.get('customer_id')
        
        if loan_id:
            if not validate_id(loan_id):
                return jsonify({'message': 'Invalid loan ID format'}), 400
            payments = payment_model.find_by_loan(loan_id)
        elif customer_id:
            if not validate_id(customer_id):
                return jsonify({'message': 'Invalid customer ID format'}), 400
            payments = payment_model.find_by_customer(customer_id)
        else:
            payments = payment_model.find_with_loan_info()
        
        return jsonify(serialize_docs(payments)), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get payments', 'error': str(e)}), 500

@app.route('/api/payments', methods=['POST'])
@jwt_required()
def create_payment():
    try:
        data = request.get_json()
        loan_id = data.get('loan_id')
        customer_id = data.get('customer_id')
        amount = data.get('amount')
        payment_date = data.get('payment_date')
        payment_method = data.get('payment_method', 'cash')
        reference_number = data.get('reference_number', '')
        notes = data.get('notes', '')

        if not all([loan_id, customer_id, amount, payment_date]):
            return jsonify({'message': 'Loan ID, customer ID, amount, and payment date are required'}), 400

        if not validate_id(loan_id) or not validate_id(customer_id):
            return jsonify({'message': 'Invalid loan or customer ID format'}), 400

        try:
            amount = float(amount)
            if amount <= 0:
                return jsonify({'message': 'Amount must be positive'}), 400
        except ValueError:
            return jsonify({'message': 'Invalid amount'}), 400

        # Validate date format
        try:
            payment_date_obj = datetime.strptime(payment_date, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

        # Check if loan exists and get details
        loan = loan_model.find_by_id(loan_id)
        if not loan:
            return jsonify({'message': 'Loan not found'}), 404

        # Check if payment amount doesn't exceed pending amount
        if amount > loan['pending_amount']:
            return jsonify({'message': 'Payment amount exceeds pending amount'}), 400

        # Verify customer owns the loan
        if str(loan['customer_id']) != str(customer_id):
            return jsonify({'message': 'Customer does not match loan'}), 400

        payment_data = {
            'loan_id': loan_id,
            'customer_id': customer_id,
            'amount': amount,
            'payment_date': payment_date_obj,
            'payment_method': payment_method,
            'reference_number': reference_number,
            'notes': notes
        }

        payment_id = payment_model.create(payment_data)
        if not payment_id:
            return jsonify({'message': 'Failed to create payment'}), 500

        # Update loan paid amount
        success = loan_model.update_paid_amount(loan_id, amount)
        if not success:
            return jsonify({'message': 'Payment created but failed to update loan'}), 500

        payment = payment_model.find_with_loan_info(payment_id)
        return jsonify(serialize_doc(payment)), 201

    except Exception as e:
        return jsonify({'message': 'Failed to create payment', 'error': str(e)}), 500

@app.route('/api/payments/<payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    try:
        if not validate_id(payment_id):
            return jsonify({'message': 'Invalid payment ID format'}), 400
        
        # Check if payment exists first
        payment = payment_model.find_by_id(payment_id)
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404

        success = payment_model.delete(payment_id)
        
        if not success:
            return jsonify({'message': 'Failed to delete payment'}), 500

        return jsonify({'message': 'Payment deleted successfully'}), 200

    except Exception as e:
        return jsonify({'message': 'Failed to delete payment', 'error': str(e)}), 500

# Dashboard routes
@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        total_villages = village_model.count()
        total_customers = customer_model.count()
        total_loans = loan_model.count()
        
        # Get loan statistics
        connection = village_model.db.get_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute("""
                SELECT 
                    COALESCE(SUM(total_amount), 0) as total_amount,
                    COALESCE(SUM(paid_amount), 0) as total_paid,
                    COALESCE(SUM(pending_amount), 0) as total_pending
                FROM loans
            """)
            result = cursor.fetchone()
            if result:
                amounts = {
                    'total_amount': float(result[0]),
                    'total_paid': float(result[1]),
                    'total_pending': float(result[2])
                }
            else:
                amounts = {'total_amount': 0, 'total_paid': 0, 'total_pending': 0}
            connection.close()
        else:
            amounts = {'total_amount': 0, 'total_paid': 0, 'total_pending': 0}

        stats = {
            'total_villages': total_villages,
            'total_customers': total_customers,
            'total_loans': total_loans,
            'total_amount': amounts['total_amount'],
            'total_paid': amounts['total_paid'],
            'total_pending': amounts['total_pending']
        }

        return jsonify(stats), 200

    except Exception as e:
        return jsonify({'message': 'Failed to get dashboard stats', 'error': str(e)}), 500

# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        connection = village_model.db.get_connection()
        if connection:
            connection.close()
            db_status = 'connected'
        else:
            db_status = 'disconnected'
        
        return jsonify({
            'status': 'healthy',
            'database': db_status,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)