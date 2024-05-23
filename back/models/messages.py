from db_config import get_db
import base64

db= get_db()

class Messages(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id =  db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )
    receiver_id =  db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )
    message = db.Column(db.String(255), nullable=True)
    image = db.Column(db.LargeBinary, nullable=True)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def __repr__(self):
        return '<id %r>' % self.id
    
    def to_json(self):
        bodyJson = {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'timestamp': self.timestamp,
            'message': self.message
        }
        if self.image != None:
            bodyJson['image'] = base64.b64encode(self.image).decode('utf-8')
        else:
            bodyJson['image'] = None
        return bodyJson