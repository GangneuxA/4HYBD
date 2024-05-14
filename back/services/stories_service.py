from flask import jsonify
from back.models.users import Users
from back.models.stories import Stories
from db_config import get_db

db= get_db()

def create_story(id, data):
    try:
        user = Users.query.get(id)
        if not user :
            return {"error": "user not found"}, 404

        new_story = Stories(
            user_id=user.id,
            image=data['image'],
            location=data.get('location')
        )
        db.session.add(new_story)
        db.session.commit()
        return new_story , 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def get_stories():
    try:
        stories = Stories.query.all()
        return stories , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def del_stories(id, user_id):
    try:
        storie = Stories.query.get(id)
        if storie.user_id == user_id:
            return {"error": "you are not the creator of the story"}, 401
        db.session.delete(storie)
        db.session.commit()
        return {"message": "story great deleted"} , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500