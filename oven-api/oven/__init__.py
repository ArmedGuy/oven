"""
The flask application package.
"""
import os
from datetime import datetime
from datetime import timedelta
from flask import Flask, g, session

app = Flask(__name__)



from .views import account, projects

if 'FLASK_DEBUG' in os.environ:
    app.config.from_object("config.DevelopmentConfig")
else:
    app.config.from_object("config.ProductionConfig")

app.secret_key = app.config['SECRET_KEY']

app.register_blueprint(account.blueprint, url_prefix='/account')
app.register_blueprint(projects.blueprint, url_prefix='/projects')

# Set the lifetime of the session cookie
app.permanent_session_lifetime = timedelta(days=1)

