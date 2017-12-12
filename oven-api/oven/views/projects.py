import os

import pytest
from oven import app
from flask import Flask
from oven import db, bsonify
from datetime import datetime
from bson.objectid import ObjectId
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g
import nomad

blueprint = Blueprint('projects', __name__, template_folder='templates')

def nomad_setup():
	n = nomad.Nomad(host=os.environ.get("NOMAD_IP", "130.240.16.191"), port=os.environ.get("NOMAD_PORT", 8301))
	return n

# Used to create a project
@blueprint.route('/', methods=['POST'])
def create():
	if session.get('logged_in'):

		data = request.get_json()
		name = data['name']
		software_id = data['software_id']
		platform_id = data['platform_id']
		# Get the current time
		create_date = datetime.now()
		
		# Submit to database before return
		project_id = db.projects.insert(
			{
				'user_id': ObjectId(session['user_id']),
				'software_id': software_id,
				'platform_id': platform_id,
				'name': short_name,
				'description': "",
				'short_description': "",
				'code_file': "",
				'dependencies': "",
				'revision': 1,
				'create_date': create_date
			}
		)
		
		project = db.projects.find_one({ '_id': ObjectId(project_id) })
		return bsonify(project)
	else:
		return jsonify({'response' : 'Forbidden'}), 403
	
# Uses session to retrieve the user´s projects
@blueprint.route('/', methods=['GET'])
def get_projects():
	
	if session.get('logged_in'):
		
		user_id = session['user_id']
		
		projects = db.projects.find({'user_id': user_id})
		return bsonify(projects)
	else:
		return jsonify({'response': 'Not logged in'}), 403
		


@blueprint.route('/jobs', methods=['GET'])
def test():
	nomad_setup = nomad.Nomad(host=os.environ.get("NOMAD_IP", "130.240.16.191"), port=os.environ.get("NOMAD_PORT", 8301))
	return bson_dumps(nomad_setup.agent.get_servers())


@blueprint.route('/<int:id>', methods=['GET'])
def get_project(id):
	if session.get('logged_in'):
		user_id = session['user_id']
		project = db.projects.find_one({'user_id': user_id, '_id': id})
		if project is not None:
			return bsonify(project)
		else:
			return jsonify({'response': 'Project not found'}), 404
	else:
		return jsonify({'response': 'Not logged in'}), 403
