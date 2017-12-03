"""
The flask application package.
"""
import os
from flask import Flask
#from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

if 'FLASK_DEBUG' in os.environ:
    app.config.from_object("config.DevelopmentConfig")
else:
    app.config.from_object("config.ProductionConfig")
	
from views import *
#db = SQLAlchemy(app)
app.secret_key = app.config['SECRET_KEY']


