from flask import jsonify
from back.models.users import Users
from back.models.messages import Messages
from db_config import get_db

db= get_db()

def create_logic():
    try:
        # create tables if not exists.
        db.create_all()
        db.session.commit()
        return {"message": "succesful created to Message table"},200

    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500
    
def send_message(data):
    try:
        sender = Users.query.get(data["sender"])
        receiver = Users.query.get(data["receiver"])
        if not sender or not receiver:
            return {"error": "user not found"}, 404

        new_message = Messages(
            sender_id=sender.id,
            receiver_id=receiver.id,
            message=data.get('message'),
            image=data.get('image')
        )
        db.session.add(new_message)
        db.session.commit()
        return new_message , 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def get_messages(data):
    try:
        sender = Users.query.get(data["sender"])
        receiver = Users.query.get(data["receiver"])
        if not sender or not receiver:
            return {"error": "user not found"}, 404
        received_messages = Messages.get_messages_between_users(sender.id, receiver.id)
        return received_messages , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def get_conversations(id):
    try:
        sender = Users.query.get(id)
        if not sender:
            return {"error": "user not found"}, 404
        conversations = Messages.get_conversations(sender.id)
        return conversations , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def del_stories(id, user_id):
    try:
        received_messages = Messages.query.get(id)
        if received_messages.sender_id == user_id:
            return {"error": "you are not the creator of the message"}, 401
        db.session.delete(received_messages)
        db.session.commit()
        return {"message": "message great deleted"} , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500