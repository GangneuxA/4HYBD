from flask import jsonify
from models.users import Users
from models.stories import Stories
from db_config import get_db

db= get_db()

def create_logic_stories():
    try:
        # create tables if not exists.
        db.create_all()
        db.session.commit()
        return {"message": "succesful created to storie table"},200

    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def create_story_srv(id, data):
    try:
        user = Users.query.get(id)
        if not user :
            return {"error": "user not found"}, 404
        
        print('OOOOOOOOOOOOOOOOOOO', flush=True)
        print(data, flush=True)
        print('OOOOOOOOOOOOOOOOOOO', flush=True)

        new_story = Stories(
            user_id=user.id,
            image=data['image'],
            location=data['location']
        )
        db.session.add(new_story)
        db.session.commit()
        return new_story.to_json() , 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def get_stories_srv():
    try:
        stories = Stories.query.all()
        stories_data = [story.to_json() for story in stories]
        return stories_data , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def del_stories_srv(id, user_id):
    try:
        storie = Stories.query.get(id)
        if storie.user_id != user_id:
            return {"error": "you are not the creator of the story"}, 401
        db.session.delete(storie)
        db.session.commit()
        return {"message": "story great deleted"} , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500