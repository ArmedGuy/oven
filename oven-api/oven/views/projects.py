import os

from oven import app
from flask import Flask
from oven import db, bsonify
from datetime import datetime
from bson.objectid import ObjectId
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g
import requests

blueprint = Blueprint('projects', __name__, template_folder='templates')

# Used to create a project
@blueprint.route('/', methods=['POST'])
def create():
	if session.get('logged_in'):

		hash = os.urandom(8)
		data = request.get_json()
		name = data['name']
		software_id = data['software_id']
		platform_id = data['platform_id']
		# Get the current time
		create_date = datetime.now()
		
		# Submit to database before return
		project_id = db.projects.insert(
			{
				'hash' : hash,
				'user_id': ObjectId(session['user_id']),
				'software_id': software_id,
				'platform_id': platform_id,
				'name': name,
				'description': "",
				'short_description': "",
				'code_file': "",
				'dependencies': "",
				'revision': 1,
				'create_date': create_date
			}
		)
		
		project = db.projects.find_one({ '_id': project_id })
		return bsonify(project)
	else:
		return jsonify({'response' : 'Forbidden'}), 403
	
# Uses session to retrieve the user´s projects
@blueprint.route('/', methods=['GET'])
def get_projects():
	
	if session.get('logged_in'):
		
		user_id = session['user_id']
		
		projects = db.projects.find({'user_id': ObjectId(user_id)})
		return bsonify(projects)
	else:
		return jsonify({'response': 'Not logged in'}), 403


@blueprint.route('/<id>', methods=['GET'])
def get_project(id):
	if session.get('logged_in'):
		user_id = session['user_id']
		project = db.projects.find_one({'user_id': ObjectId(user_id), '_id': ObjectId(id)})
		if project is not None:
			return bsonify(project)
		else:
			return jsonify({'response': 'Project not found'}), 404
	else:
		return jsonify({'response': 'Not logged in'}), 403

@blueprint.route('/<id>/code/<hash>', methods=['GET'])
def get_project_code(id, hash):
	project_id = ObjectId(id)
	project = db.projects.find_one({'_id': project_id, 'hash': hash})
	return project['code_file']

@blueprint.route('/<id>', methods=['PUT'])
def save_project(id):
	if session.get('logged_in'):
		user_id = session['user_id']
		project = db.projects.find_one_and_update(
			{'user_id': ObjectId(user_id), '_id': ObjectId(id)},
			{'$set': request.get_json()},
		)
		if project is not None:
			return jsonify({'response': 'OK'})
		else:
			return jsonify({'response': 'Project not found'}), 404
	else:
		return jsonify({'response': 'Not logged in'}), 403
		
@blueprint.route('/<id>/deploy', methods=['POST'])
def deploy_project(id):
	if not session.get("logged_in"):
		return jsonify({'response': 'Not logged in'}), 403
	user_id = ObjectId(session['user_id'])
	user = db.users.find_one({'_id': user_id})
	project = db.projects.find_one({'_id': ObjectId(id), 'user_id': user_id})
	name = "{}-{}-{}".format(user['username'], project['name'], "bla")
	task_name = "{}-{}".format(user['username'], project['name'])
	url_prefix = "/oven/api/{}/{}".format(user['username'], project['name'])
	artifact_url = "{}/projects/{}/code/{}".format(app.config['API_URL'], id, project['hash'])
	job = {
		"job": {
			"ID": id,
			"Name": name,
			"Type":"service",
			"Priority":50,
			"Datacenters":[
				"dh2"
			],
			"TaskGroups":[
				{
					"Name":"www",
					"Count":1,
					"Tasks":[
						{
							"Name": task_name,
							"Driver":"docker",
							"Config":{
								"image":"armedguy/oven-python3flask",
								"port_map":[
									{
										"www":80
									}
								],
								"volumes": [
									"local/:/app"
								]
							},
							"Artifacts": [
								{
									"RelativeDest": "local/",
									"GetterSource": artifact_url
								}
							],
							"Services":[
								{
									"Name":name,
									"Tags":[
										"urlprefix-{} strip={}".format(url_prefix, url_prefix),
										"cache"
									],
									"PortLabel":"www",
									"AddressMode":"",
									"Checks":[
										{
											"Type":"http",
											"Path": "/",
											"Interval": 10000000000,
											"Timeout": 20000000000,
										}
									]
								}
							],
							"Resources":{
								"CPU":500,
								"MemoryMB":256,
								"Networks":[
								{
									"MBits":10,
									"DynamicPorts":[
										{
											"Label":"www",
											"Value":0
										}
									]
								}
								]
							}
						}
					],
					"EphemeralDisk":{
						"SizeMB":300
					}
				}
			],
			"Update":{
				"MaxParallel":1,
				"MinHealthyTime":10000000000,
				"HealthyDeadline":180000000000,
				"Canary":0
			}
		}
	}
	# register job with nomad			
	resp = requests.put("http://{}:4646/v1/job/{}".format(app.config['NOMAD_IP'], id), json=job)
	print(resp.text)
	return jsonify({"yay": "bla"})
