from db_config import get_db

db= get_db()

class Stories(db.Model):
    __tablename__ = 'stories'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    image = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    location = db.Column(db.String(255), nullable=True)

    user = db.relationship('Users', backref='stories')

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image': self.image,
            'timestamp': self.timestamp,
            'location': self.location
        }