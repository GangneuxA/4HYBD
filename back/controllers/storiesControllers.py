from flask_jwt_extended import jwt_required, get_jwt_identity
from services.stories_service import(
    create_story_srv,
    get_stories_srv,
    del_stories_srv
)
from flask import request, jsonify

@jwt_required()
def create_story():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 404
        
        user_id, user_role = get_jwt_identity()
        data = {
           "location": request.form['location'],
           "image": request.files['image'].read()
        }
        message, status_code = create_story_srv(user_id, data)
        print("##############################################", flush=True)
        print(message, status_code, flush=True)
        print("##############################################", flush=True)
        return message, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

@jwt_required()
def get_stories():
    try:
        message, status_code = get_stories_srv()
        return message, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': ' Internal Server Error', "error": str(e)}), 500


@jwt_required()
def del_stories(id):
    try:
        user_id, user_role = get_jwt_identity()
        message, status_code = del_stories_srv(id, user_id)
        return message, status_code
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500