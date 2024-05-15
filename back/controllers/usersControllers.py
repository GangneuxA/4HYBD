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
from services.message_service import (create_logic_message)
from services.stories_service import (create_logic_stories)

def create():
    try:
        response_user, status_code_user = create_logic()
        response_message, status_code_message = create_logic_message()
        response_stories, status_code_stories = create_logic_stories()
        if status_code_stories == 200 and status_code_user == 200 and status_code_message == 200:
            return jsonify({"user": response_user, "message": response_message, "stories": response_stories}), 200
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
