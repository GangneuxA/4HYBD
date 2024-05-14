from flask_jwt_extended import jwt_required, get_jwt_identity
from services.stories_service import(
    create_story,
    get_stories,
    del_stories
)
from flask import request, jsonify

@jwt_required()
def create_story():
    try:
        user_id, user_role = get_jwt_identity()
        data = request.get_json()
        new_story = create_story(user_id, data)
        return new_story , 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

@jwt_required()
def get_stories():
    try:
        stories = get_stories()
        return stories , 200
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