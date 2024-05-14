from db_config import get_db

db= get_db()

class Messages(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=True)
    image = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    sender = db.relationship('Users', foreign_keys=[sender_id], backref='sent_messages')
    receiver = db.relationship('Users', foreign_keys=[receiver_id], backref='received_messages')

    @staticmethod
    def get_conversations(user_id):
        sent_messages = db.session.query(Messages.receiver_id.label('user_id')).filter(Messages.sender_id == user_id)
        received_messages = db.session.query(Messages.sender_id.label('user_id')).filter(Messages.receiver_id == user_id)
        conversations = sent_messages.union(received_messages).distinct().all()
        return conversations
    
    @staticmethod
    def get_messages_between_users(user1_id, user2_id):
        messages = Messages.query.filter(
            ((Messages.sender_id == user1_id) & (Messages.receiver_id == user2_id)) |
            ((Messages.sender_id == user2_id) & (Messages.receiver_id == user1_id))
        ).order_by(Messages.timestamp).all()
        return messages