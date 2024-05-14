# Importing the necessary modules and libraries
from flask import Flask
from flask_migrate import Migrate
from routes.blueprint import blueprint
from flask_jwt_extended import JWTManager
from flask_swagger_ui import get_swaggerui_blueprint
from db_config import get_db
from flask_cors import CORS
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger.json'
db = get_db()

def create_app():
    app = Flask(__name__)  # flask app object
    app.config.from_object('config')  # Configuring from Python Files
    JWTManager(app)
    db.init_app(app)  # Initializing the database
    cors = CORS(app, resources={f"/*": {"origins": "*"}})
    return app


# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  
    API_URL,
    config={
        'app_name': "Test application"
    },
)


app = create_app()
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

app.register_blueprint(blueprint, url_prefix='/')
migrate = Migrate(app, db)

if __name__ == '__main__':  # Running the app
    app.run(host='127.0.0.1', debug=True)