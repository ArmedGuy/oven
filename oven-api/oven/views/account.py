import os

from oven import app
from flask import Flask
from datetime import datetime
from pymongo import MongoClient
from bson.json_util import dumps
from flask_pymongo import PyMongo
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify

client = MongoClient('localhost', 27017)
db = client.oven

blueprint = Blueprint('account', __name__, template_folder='templates')

@blueprint.route('/session', methods=["GET"])
def get_session():
	
	# LTU CAS here
	
	# if login ok:	
	session['user'] = 'Test_user'
	return "{'response':'Session created!'}"
	
	# else:
	#	return 'Login error!'
	
@blueprint.route('/verify', methods=["GET"])
def verify():
	if 'user' in session:
		return session['user']
	else:
		return "{'response':'You are not logged in...'}"
		
@blueprint.route('/drop', methods=["GET"])
def drop():
	if 'user' in session:
		session.pop('user', None)
		return 'Logged out!'
	else:
		return "{'response':'You are not logged in...'}"
	
	
	
	
	
### The blueprints bellow will be removed @ a later date, used 4 testing...
@blueprint.route('/', methods=["POST"])
def add_user():
	users = []
	for x in db.users.find():
		users.append(x)
	return dumps(users)
	

@blueprint.route('/<id>', methods=["GET"])
def get_user(id):
	try:
		return id
	except:
		return "ERROR!"

	