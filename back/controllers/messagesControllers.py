from flask import request, jsonify
from services.message_service import(
    send_message_srv,
    get_messages_srv,
    get_conversations_srv,
    del_stories_srv
)
from flask_jwt_extended import jwt_required, get_jwt_identity

@jwt_required()
def send_message():
    try:
        user_id, user_role = get_jwt_identity()
        data = {
           "receiver": request.form['receiver'],
        }
        if 'image' in request.files:
            data["image"]= request.files['image'].read()
        if 'message' in request.form:
            data["message"]= request.form['message']
        print(data)
        message, status_code  = send_message_srv(user_id, data)
        print("##############################################", flush=True)
        print(message, status_code, flush=True)
        print("##############################################", flush=True)
        return message, status_code 
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500
    
@jwt_required()
def get_messages(id):
    try:
        user_id, user_role = get_jwt_identity()
        message, status_code  = get_messages_srv(user_id, id)
        return  message, status_code 
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

@jwt_required()
def get_conversations():
    try:
        user_id, user_role = get_jwt_identity()
        message, status_code  = get_conversations_srv(user_id)
        return  message, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

@jwt_required()
def del_message(id):
    try:
        user_id, user_role = get_jwt_identity()
        message, status_code = del_stories_srv(id, user_id)
        return  message, status_code 
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500
