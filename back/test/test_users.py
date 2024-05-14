import unittest
from app import app
from db_config import get_db
from models.users import users

db= get_db()


class TestUserGet(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()

    def test_get_user_as_admin(self):
        with self.client:
            user = users(name="sored", email='employee' , companie='employee', role='admin')
            user.set_password('password')
            db.session.add(user)
            db.session.commit()

            token = self.login_user('employee', 'password')

            response = self.client.get('/users', headers={'Authorization': f'Bearer {token}'})
            data = response.get_json()
            db.session.delete(user)
            db.session.commit()

            self.assertEqual(response.status_code, 200)
            self.assertTrue(isinstance(data, list))
            self.assertTrue(len(data) >= 0)


    def test_get_user_as_regular_user(self):
        with self.client:
            user_obj = users(name="sored",email='user', companie='employee', role='user')
            user_obj.set_password('password')
            db.session.add(user_obj)
            db.session.commit()

            token = self.login_user('user', 'password')

            response = self.client.get('/users', headers={'Authorization': f'Bearer {token}'})

            db.session.delete(user_obj)
            db.session.commit()
            self.assertEqual(response.status_code, 403)


    def test_unauthorized_access(self):
        with self.client:
            response = self.client.get('/users')
            self.assertEqual(response.status_code, 401)

    #function to connect
    def login_user(self, email, password):
        response = self.client.post('/login', json={'email': email, 'password': password}, content_type='application/json')
        data = response.get_json()
        return data['access_token']
    

class TestGetMe(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()

    def tearDown(self):
        db.session.rollback()

    def test_get_me_as_admin(self):
        with self.client:
            user = users(name="John Doe", email="john@example.com", companie="Company XYZ", role="admin")
            user.set_password('password')
            db.session.add(user)
            db.session.commit()

            token = self.login_user("john@example.com", "password")

           
            response = self.client.get("/getme", headers={"Authorization": f"Bearer {token}"})
            db.session.delete(user)
            db.session.commit() 
            self.assertEqual(response.status_code, 200)

            data = response.get_json()
            self.assertEqual(data["name"], "John Doe")
            self.assertEqual(data["email"], "john@example.com")
            self.assertEqual(data["companie"], "Company XYZ")
            self.assertEqual(data["role"], "admin")

    def test_get_me_as_regular_user(self):
        with self.client:
            user = users(name="Jane Doe", email="jane@example.com", companie="Company ABC", role="user")
            user.set_password('password')
            db.session.add(user)
            db.session.commit()

            token = self.login_user("jane@example.com", "password")
            response = self.client.get("/getme", headers={"Authorization": f"Bearer {token}"})
            db.session.delete(user)
            db.session.commit() 
            self.assertEqual(response.status_code, 200)

            data = response.get_json()
            self.assertEqual(data["name"], "Jane Doe")
            self.assertEqual(data["email"], "jane@example.com")
            self.assertEqual(data["companie"], "Company ABC")
            self.assertEqual(data["role"], "user")

    def test_get_me_unauthorized(self):
        with self.client:
            response = self.client.get("/getme")
            self.assertEqual(response.status_code, 401)

    # Méthode pour authentifier un utilisateur
    def login_user(self, email, password):
        response = self.client.post("/login", json={"email": email, "password": password})
        data = response.get_json()
        return data["access_token"]
    
class TestInsert(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_insert_user(self):
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "companie": "Company XYZ",
            "password": "password"
        }

        response = self.app.post('/users', json=user_data)
        user = users.query.filter_by(email="john@example.com").first()
        if user:
            db.session.delete(user)
            db.session.commit()
        
        self.assertEqual(response.status_code, 201)
    def test_insert_user_error(self):
        response = self.app.post('/users', json={})

        self.assertEqual(response.status_code, 300)

        data = response.get_json()
        self.assertEqual(data['error'], 'missing field json')



class TestUserDelete(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()

    def test_delete_user(self):
        with self.client:
            user_obj = users(name="sored", email='employee' , companie='employee', role='admin')
            user_obj.set_password('password')
            db.session.add(user_obj)
            db.session.commit()

            token = self.login_user('employee', 'password')

            response = self.client.delete('/users', headers={'Authorization': f'Bearer {token}'})
            deleted_user = users.query.get(user_obj.id)

            self.assertEqual(response.status_code, 200)
            self.assertIsNone(deleted_user)

    def test_delete_user_not_found(self):
        with self.client:
            user_obj = users(name="sored", email='employee' , companie='employee', role='admin')
            user_obj.set_password('password')
            db.session.add(user_obj)
            db.session.commit()

            token = self.login_user('employee', 'password')
            db.session.delete(user_obj)
            db.session.commit()

            response = self.client.delete('/users', headers={'Authorization': f'Bearer {token}'})

            self.assertEqual(response.status_code, 500)

    def test_delete_user_unauthenticated(self):
        with self.client:
            response = self.client.delete('/users')
            self.assertEqual(response.status_code, 401)

    def login_user(self, email, password):
        response = self.client.post('/login', json={'email': email, 'password': password}, content_type='application/json')
        data = response.get_json()
        return data['access_token']

class TestLogout(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()

    def test_logout(self):
        with self.client:
            user_obj = users(name="sored", email='employee' , companie='employee', role='admin')
            user_obj.set_password('password')
            db.session.add(user_obj)
            db.session.commit()
            token = self.login_user('employee', 'password')

            response = self.client.post('/logout', headers={'Authorization': f'Bearer {token}'})
            db.session.delete(user_obj)
            db.session.commit()
            
            self.assertEqual(response.status_code, 500)

    def test_logout_unauthenticated(self):
        with self.client:
            response = self.client.post('/logout')
            self.assertEqual(response.status_code, 401)

    def login_user(self, email, password):
        response = self.client.post('/login', json={'email': email, 'password': password}, content_type='application/json')
        data = response.get_json()
        return data['access_token']

class TestLogin(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()

    def test_login_successful(self):
        with self.client:
            user_obj = users(name="sored", email='employee' , companie='employee', role='admin')
            user_obj.set_password('password')
            db.session.add(user_obj)
            db.session.commit()

            login_data = {
                'email': 'employee',
                'password': 'password'
            }

            response = self.client.post('/login', json=login_data)
            db.session.delete(user_obj)
            db.session.commit()

            self.assertEqual(response.status_code, 200)

    def test_login_user_not_found(self):
        with self.client:
            login_data = {
                'email': 'nonexistent@example.com',
                'password': 'password'
            }

            response = self.client.post('/login', json=login_data)

            self.assertEqual(response.status_code, 401)


    def test_login_wrong_password(self):
        with self.client:
            user_obj = users(name="sored", email='employee' , companie='employee', role='admin')
            user_obj.set_password('password')
            db.session.add(user_obj)
            db.session.commit()

            login_data = {
                'email': 'test@example.com',
                'password': 'wrong_password'
            }
            response = self.client.post('/login', json=login_data)
            db.session.delete(user_obj)
            db.session.commit()

            self.assertEqual(response.status_code, 401)

    def test_login_missing_json(self):
        with self.client:
            response = self.client.post('/login')
            self.assertEqual(response.status_code, 500)

class TestUserPut(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app_context = app.app_context()
        self.app_context.push()
        self.client = app.test_client()

    def test_update_user(self):
        with self.client:
            user_obj = users(name="sored", email='employee' , companie='employee', role='admin')
            user_obj.set_password('password')
            db.session.add(user_obj)
            db.session.commit()

            token = self.login_user('employee', 'password')

            updated_data = {
                'name': 'updated_name',
                'email': 'updated@example.com',
                'password': 'updated_password'
            }

            response = self.client.put(f'/users', json=updated_data, headers={'Authorization': f'Bearer {token}'})
            updated_user = users.query.get(user_obj.id)
            db.session.delete(updated_user)
            db.session.commit()

            self.assertEqual(response.status_code, 200)
            self.assertEqual(updated_user.name, updated_data['name'])
            self.assertEqual(updated_user.email, updated_data['email'])
            self.assertTrue(updated_user.check_password(updated_data['password']))

    def login_user(self, email, password):
        response = self.client.post('/login', json={'email': email, 'password': password}, content_type='application/json')
        data = response.get_json()
        return data['access_token']

if __name__ == '__main__':
    unittest.main()