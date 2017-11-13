"""
The flask application package.
"""
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)

if 'FLASK_DEBUG' in os.environ:
    app.config.from_object("config.DevelopmentConfig")
else:
    app.config.from_object("config.ProductionConfig")

db = SQLAlchemy(app)
app.secret_key = app.config['SECRET_KEY']

app.permanent_session_lifetime = timedelta(hours=24)

from .views import webapp, account, projects

app.register_blueprint(webapp.blueprint)
app.register_blueprint(account.blueprint)
app.register_blueprint(projects.blueprint)
