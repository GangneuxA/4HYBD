import os
from dotenv import load_dotenv
load_dotenv()

SECRET_KEY = os.getenv('APP_SUPER_KEY')
basedir = os.path.abspath(os.path.dirname(__file__))
DEBUG = True
SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = False