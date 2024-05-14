from flask import request, jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity 
from services.user_service import (
    insert_logic, 
    create_logic,
    index_logic,
    update_logic,
    delete_logic,
    logout_service,
    login_service,
    get_user_by_id_service,
)
from back.services.message_service import (create_db_logic)

def create():
    try:
        response_user, status_code_user = create_logic()
        response_job, status_code_job = create_db_logic()
        if status_code_job == 200 and status_code_user == 200:
            return jsonify({"user": response_user, "job": response_job}), 200
        else:
            raise Exception("Error tables creation")
    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500

@jwt_required()
def get_me():
    try:
        user_id, user_role = get_jwt_identity()
        response, status_code = get_user_by_id_service(user_id)
        return jsonify(response), status_code

    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500

@jwt_required() 
def index():
    try:
        user_id, user_role = get_jwt_identity()
        print(user_id,user_role)
        if user_role != "admin":
            return jsonify({"message": "You are not authorized to access this resource."}), 403
        response, status_code = index_logic()
        return response, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500

def insert():
    try:
        user_data = request.get_json()
        response, status_code = insert_logic(user_data)
        return response, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500
    
@jwt_required()
def update():
    try:
        user_id, user_role = get_jwt_identity()
        user_data = request.get_json()
        response, status_code = update_logic(user_id, user_data)
        return response, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500

@jwt_required()
def delete():
    try:
        user_id, user_role = get_jwt_identity()
        response, status_code = delete_logic(user_id)
        return response, status_code

    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500
    
def login():
    try:
        credentials = request.get_json()
        response, status_code = login_service(credentials)
        return response, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500

@jwt_required()
def logout():
    try:
        return jsonify({"message":  'you are logout'}), 200

    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error', "error": str(e)}), 500
