import os

from oven import app
from flask import Flask
from datetime import datetime
from pymongo import MongoClient
from bson.json_util import dumps
from flask_pymongo import PyMongo
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g

client = MongoClient('localhost', 27017)
db = client.oven

blueprint = Blueprint('projects', __name__, template_folder='templates')

# Used to create a project
@blueprint.route('/create/<project>', methods=['POST'])
def create(project):
	if g.session:
		
			# Get parameters
		try:
			software_id = request.form['software_id']
		except:
			return "ERROR, no software_id defined!"
		try:
			platform_id = request.form['platform_id']
		except:
			return "ERROR, no platform_id defined!"
		try:
			short_name = request.form['short_name']
		except:
			return "ERROR, no short_name defined!"
		try:
			description = request.form['description']
		except:
			return "ERROR, no description defined!"
		try:
			short_description = request.form['short_description']
		except:
			return "ERROR, no short_description defined!"
		try:
			code_file = request.form['code_file']
		except:
			return "ERROR, no code_file defined!"
		try:
			dependencies = request.form['dependencies']
		except:
			return "ERROR, no dependencies defined!"
		try:
			revision = request.form['revision']
		except:
			return "ERROR, no revision defined!"
		
		# Get the current time
		create_date = datetime.now()
		
		# Verify the user
		user = db.users.find_one({'mail':request.form['mail']})
		
		# Submit to database before return
		db.projects.insert({'created_by_user_id':user['_id'],'software_id':software_id,'platform_id':platform_id,'short_name':short_name,'description':description,'short_description':short_description,'code_file':code_file,'dependencies':dependencies,'revision':revision,'create_date':create_date})
		
		# for testing...
		#user = db.users.find_one({'mail':'me@me.me'})
		#db.projects.insert({'created_by_user_id':user['_id'],'user':user['user'],'mail':'mail@mail.mail', 'config':{'software_id':'1','platform_id':'1','shortName':'1','description':'1','shortDescription':'1','codeFile':'1','dependencies':'1','revision':'1','create_date':create_date}})

		
		return "Success!!\n" + project + " created on " + dumps(create_date) + "!\n"
	else:
		return "{'response':'You are not logged in...'}"
	
# Uses session to retrieve the user´s projects
@blueprint.route('/', methods=['GET'])
def get_projects():
	if g.session:
	
		user = g.session['user']
		mail = g.session['mail']
		
		#Get the users _id. If the user is not found in the database, let the user know.
		user_details = db.users.find_one({'user':user,'mail':mail})
		if user_details == []:
			return "{'response':'Error, you are not an registered user!'}"
		_id = user_details['_id']
		
		# Now use the _id to find all the projects belonging to the user
		user_projects = db.projects.find({'created_by_user_id':_id})	
		if user_details == []:
			return "{'response':'Error, you do not have any projects!'}"
		projects = []
		for project in user_projects:
			projects.append(project['short_name'])
		
		# Create a phrase to return (This is for testing and will be replaced...)
		return_phrase = ""
		for name in projects:
			return_phrase += name + "\n"
		
		return return_phrase
			
		
	else:
		return "{'response':'Error, try to login?'}"


