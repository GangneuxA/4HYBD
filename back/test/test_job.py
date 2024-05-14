import unittest
from app import app
from db_config import get_db
from models.job import job
from models.users import users

db= get_db()


class TestJobGet(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()
        self.admin_token = self.create_user(name="admin", mail="admin@example.com", role="admin")
        self.user_token = self.create_user(name="user", mail="user@example.com", role="user")

    def tearDown(self):
        admin_user = users.query.filter_by(email="admin@example.com").first()
        if admin_user:
            db.session.delete(admin_user)
            db.session.commit()

        user_user = users.query.filter_by(email="user@example.com").first()
        if user_user:
            db.session.delete(user_user)
            db.session.commit()
    def test_get_job_as_admin_user(self):
        with self.client:
            new_job = job(images="test",        
                         commands="test", user=self.admin_token[1],repo="test")
            db.session.add(new_job)
            db.session.commit()

            response = self.client.get('/job', headers={'Authorization': f'Bearer {self.admin_token[0]}'})

            db.session.delete(new_job)
            db.session.commit()
            self.assertEqual(response.status_code, 200)

    def test_get_job_as_regular_user(self):
        with self.client:
            new_job = job(images="test",
                         commands="test", user=self.user_token[1],repo="test")
            db.session.add(new_job)
            db.session.commit()

            response = self.client.get('/job', headers={'Authorization': f'Bearer {self.user_token[0]}'})

            db.session.delete(new_job)
            db.session.commit()
            self.assertEqual(response.status_code, 403)

    def create_user(self, name , mail,role):
        admin_user = users(name=name, email=mail , companie='companie', role=role)
        admin_user.set_password("admin_password")
        db.session.add(admin_user)
        db.session.commit()
        response = self.client.post('/login', json={'email': mail, 'password': 'admin_password'})
        data = response.get_json()
        return data['access_token'], admin_user.id
    
class TestJobPost(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()
        self.admin_token = self.create_user(name="admin", mail="admin@example.com", role="admin")
        self.user_token = self.create_user(name="user", mail="user@example.com", role="user")
    def tearDown(self):
        admin_user = users.query.filter_by(email="admin@example.com").first()
        if admin_user:
            db.session.delete(admin_user)
            db.session.commit()

        user_user = users.query.filter_by(email="user@example.com").first()
        if user_user:
            db.session.delete(user_user)
            db.session.commit()
    


    def test_get_job_as_regular_user(self):
        with self.client:
            response = self.client.post("/job")
            self.assertEqual(response.status_code, 401)

    def create_user(self, name , mail,role):
        admin_user = users(name=name, email=mail , companie='companie', role=role)
        admin_user.set_password("admin_password")
        db.session.add(admin_user)
        db.session.commit()
        response = self.client.post('/login', json={'email': mail, 'password': 'admin_password'})
        data = response.get_json()
        return data['access_token'], admin_user.id

class TestdeleteGet(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()
        self.admin_token = self.create_user(name="admin", mail="admin@example.com", role="admin")
        self.user_token = self.create_user(name="user", mail="user@example.com", role="user")
        
    def tearDown(self):
        admin_user = users.query.filter_by(email="admin@example.com").first()
        if admin_user:
            db.session.delete(admin_user)
            db.session.commit()

        user_user = users.query.filter_by(email="user@example.com").first()
        if user_user:
            db.session.delete(user_user)
            db.session.commit()

    def test_del_job_as_admin_user(self):
        with self.client:
            new_job = job(images="test",        
                         commands="test", user=self.admin_token[1],repo="test")
            db.session.add(new_job)
            db.session.commit()

            response = self.client.delete('/job/'+str(new_job.id), headers={'Authorization': f'Bearer {self.admin_token[0]}'})

            db.session.delete(new_job)
            db.session.commit()
            self.assertEqual(response.status_code, 200)

    def test_del_job_as_regular_user(self):
        with self.client:
            new_job = job(images="test",
                         commands="test", user=self.user_token[1],repo="test")
            db.session.add(new_job)
            db.session.commit()

            response = self.client.delete('/job/'+str(new_job.id), headers={'Authorization': f'Bearer {self.user_token[0]}'})

            db.session.delete(new_job)
            db.session.commit()
            self.assertEqual(response.status_code, 403)

    def create_user(self, name , mail,role):
        admin_user = users(name=name, email=mail , companie='companie', role=role)
        admin_user.set_password("admin_password")
        db.session.add(admin_user)
        db.session.commit()
        response = self.client.post('/login', json={'email': mail, 'password': 'admin_password'})
        data = response.get_json()
        return data['access_token'], admin_user.id