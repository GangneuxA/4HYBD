from db_config import get_db
from werkzeug.security import generate_password_hash, check_password_hash

db= get_db()

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role = db.Column(db.String(80), nullable=False, default="member")
    email = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    pseudo = db.Column(db.String(80), nullable=False, unique=True)

    def __repr__(self):
        return '<pseudo %r>' % self.pseudo

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_json(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'pseudo': self.pseudo
        }