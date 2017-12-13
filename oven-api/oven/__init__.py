"""
The flask application package.
"""

import os
from datetime import datetime
from datetime import timedelta
import json
from bson.json_util import dumps as bson_dumps, RELAXED_JSON_OPTIONS
from flask import Flask, g, session, request, make_response
from pymongo import MongoClient

app = Flask(__name__)

if 'FLASK_DEBUG' in os.environ:
    app.config.from_object("config.DevelopmentConfig")
else:
    app.config.from_object("config.ProductionConfig")

app.secret_key = app.config['SECRET_KEY']
client = MongoClient('localhost', 27017)
db = client.oven

def bsonify(bson_data):
    response = make_response(bson_dumps(bson_data, json_options=RELAXED_JSON_OPTIONS))
    response.headers['Content-Type'] = 'application/json'
    return response


from .views import account, projects

app.register_blueprint(account.blueprint, url_prefix='/api/account')
app.register_blueprint(projects.blueprint, url_prefix='/api/projects')

# Set the lifetime of the session cookie
#app.permanent_session_lifetime = timedelta(days=1)

@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = 'http://localhost:9000'
    header['Access-Control-Allow-Credentials'] = 'true'
    header['Access-Control-Allow-Headers'] = "Content-Type"
    header['Access-Control-Allow-Methods'] = "OPTIONS,GET,PUT,POST,DELETE"
    header['Vary'] = 'Origin'
    return response

