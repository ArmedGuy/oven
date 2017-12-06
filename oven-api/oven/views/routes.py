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

def activeusers():
    online_users = mongo.db.users.find({'online': True})
    return render_template('index.html',
        online_users=online_users)

@app.route('/')
def home():
	i = 0
	while i <= 2:
		db.users.insert({'user':''+str(1)+''})
		i += 1
	return '<h1>Works!</h1>'

@app.route('/getuser', methods=['GET', 'POST'])
def getuser():
	users = []
	for x in db.users.find():
		users.append(x)
	return dumps(users)

		
@app.route('/createservice', methods=['POST'])
def createservice():
	service = mongo.db.service
	name =  request.json['name']
	stack =  request.json['stack']
	platform = request.json['platform']
	id = request.json['id']
	output = {'name' : name, 'stack' : stack, 'platform' : platform, 'id' : id}
	return jsonify({'result' : output})

@app.route('/upload/', methods=['POST'])
def uploadconfig():
	config = mongo.db.config
	id = request.json['id']
	projid = request.json['projid']
	projconf = request.json['projconf']
	output = {'id' : id, 'projid' : projid, 'projconf' : projconf}
	return jsonify({'result' : output})
	
@app.route('/user/<username>')
def user_profile(username):
    user = mongo.db.users.find_one_or_404({'id': username})
    return jsonify({'result' : user})
	
@app.route('/services')
def services():
    services = mongo.db.services.find_one_or_404({})
    return jsonify({'result' : services})
	
