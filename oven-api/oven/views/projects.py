import os

from oven import app
from flask import Flask
from datetime import datetime
from pymongo import MongoClient
from bson.json_util import dumps as bson_dumps
from flask_pymongo import PyMongo
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g

from app import db

blueprint = Blueprint('projects', __name__, template_folder='templates')

# Used to create a project
@blueprint.route('/', methods=['POST'])
def create():
	if session.get('logged_in'):
		
		# Get the current time
		create_date = datetime.now()
		
		# Submit to database before return
		project_id = db.projects.insert(
			{
				'user_id': sessio['user_id'],
				'software_id': software_id,
				'platform_id': platform_id,
				'short_name': short_name,
				'description': "",
				'short_description': short_description,
				'code_file': "",
				'dependencies': "",
				'revision': 1,
				'create_date': create_date
			}
		)
		
		project = db.projects.find_one({ '_id': project_id })
		return bson_dumps(project)
	else:
		return jsonify({'response' : 'Forbidden'}), 403
	
# Uses session to retrieve the user´s projects
@blueprint.route('/', methods=['GET'])
def get_projects():
	if session.get('logged_in')
	
		user_id = session['user_id']
		
		#Get the users _id. If the user is not found in the database, let the user know.
		user = db.users.find_one({'_id': user_id})
		if not user
			return jsonify({'response': 'User not found'}), 404
		_id = user_details['_id']
		
		# Now use the _id to find all the projects belonging to the user
		projects = db.projects.find({'user_id':_id})
		return bson_dumps(projects)
	else:
		return jsonify({'response': 'Not logged in'}), 403


