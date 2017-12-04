"""
The flask application package.
"""
import os
from flask import Flask
from flask_pymongo import PyMongo

from flask import request
from flask import jsonify
from flask import render_template
from datetime import datetime
from .views import account, projects


app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'restdb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/restdb'

mongo = PyMongo(app)

if 'FLASK_DEBUG' in os.environ:
    app.config.from_object("config.DevelopmentConfig")
else:
    app.config.from_object("config.ProductionConfig")

from views import *

app.register_blueprint(account.blueprint, url_prefix='/account')
app.register_blueprint(projects.blueprint, url_prefix='/projects')

app.secret_key = app.config['SECRET_KEY']




@app.route('/')
def home():
    return '<h1>Works!</h1>\n'

@app.route('/getuser', methods=['GET', 'POST'])
def getuser():
	if request.method == "POST":
		userid = request.form['userid']
		return 'search for id ' + userid + '\n'
	else:
		return 'Send a POST request!\n'
