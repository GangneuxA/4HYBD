from flask import jsonify
from models.users import Users
from models.messages import Messages
from db_config import get_db

db= get_db()

def create_logic_message():
    try:
        # create tables if not exists.
        db.create_all()
        db.session.commit()
        return {"message": "succesful created to Message table"},200

    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500
    
def send_message_srv(user_id,data):
    try:
        sender = Users.query.get(user_id)
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
        return new_message.to_json() , 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def get_messages_srv(id ,data):
    try:
        sender = Users.query.get(id)
        receiver = Users.query.get(data)
        if not sender or not receiver:
            return {"error": "user not found"}, 404
        
        received_messages = Messages.query.filter(
            ((Messages.sender_id == sender.id) & (Messages.receiver_id == receiver.id)) |
            ((Messages.sender_id == receiver.id) & (Messages.receiver_id == sender.id))
        ).order_by(Messages.timestamp).all()

        print(received_messages)
        received_messages_data = [message.to_json() for message in received_messages]
        return received_messages_data , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def get_conversations_srv(id):
    try:
        sender = Users.query.get(id)
        if not sender:
            return {"error": "user not found"}, 404
        sent_messages = db.session.query(Messages.receiver_id.label('user_id')).filter(Messages.sender_id == id)
        received_messages = db.session.query(Messages.sender_id.label('user_id')).filter(Messages.receiver_id == id)
        conversations = sent_messages.union(received_messages).distinct().all()
        conversation_ids = [conv.user_id for conv in conversations]
        return jsonify(conversation_ids) , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500

def del_stories_srv(id, user_id):
    try:
        received_messages = Messages.query.get(id)
        if received_messages.sender_id != user_id:
            return {"error": "you are not the creator of the message"}, 401
        db.session.delete(received_messages)
        db.session.commit()
        return {"message": "message great deleted"} , 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Service Internal Server Error', "error": str(e)}), 500