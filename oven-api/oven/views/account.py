from flask import url_for, Blueprint, render_template, request, session, redirect

from oven import app
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask import request
from flask import jsonify
from flask import render_template
from datetime import datetime
from bson.json_util import dumps

client = MongoClient('localhost', 27017)
db = client.oven

blueprint = Blueprint('account', __name__, template_folder='templates')



@blueprint.route('/session', methods=['GET'])
def get_session():
	pass
	
	
@blueprint.route('/session/verify', methods=['GET'])
def verify():
	pass
	
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
