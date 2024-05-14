from flask import request, jsonify
from services.message_service import(
    send_message,
    get_messages,
    get_conversations,
    del_stories
)
from flask_jwt_extended import jwt_required, get_jwt_identity

@jwt_required()
def send_message():
    try:
        user_id, user_role = get_jwt_identity()
        data = request.get_json()
        new_message = send_message(user_id, data)
        return new_message , 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500
    
@jwt_required()
def get_messages():
    try:
        user_id, user_role = get_jwt_identity()
        data = request.get_json()
        received_messages = get_messages(user_id, data)
        return received_messages , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

@jwt_required()
def get_conversations():
    try:
        user_id, user_role = get_jwt_identity()
        conversations = get_conversations(user_id)
        return conversations , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

@jwt_required()
def del_stories(id):
    try:
        user_id, user_role = get_jwt_identity()
        status_code, message = del_stories(id, user_id)
        return message, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500
