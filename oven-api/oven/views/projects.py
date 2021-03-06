import os

from oven import app
from flask import Flask
from oven import db, bsonify
from datetime import datetime
from bson.objectid import ObjectId
from bson.binary import Binary
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g, make_response
import requests
import re

PROJECT_NAME_REGEX = re.compile("^[a-z0-9-]+$")

blueprint = Blueprint('projects', __name__, template_folder='templates')

# Used to create a project
@blueprint.route('/', methods=['POST'])
def create():
	if session.get('logged_in'):
		data = request.get_json()
		name = data['name']
		if not PROJECT_NAME_REGEX.match(name):
			return jsonify({'response': 'Invalid name'}), 400
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
				'name': name,
				'description': "",
				'short_description': "",
				'code_file': "",
				'revision': 1,
				'environment_id': None,
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

@blueprint.route('/<id>/code/<filename>', methods=['GET'])
def get_project_code(id, filename):
	project_id = ObjectId(id)
	project = db.projects.find_one({'_id': project_id})
	return project['code_file']

@blueprint.route('/<id>', methods=['PUT'])
def save_project(id):
	if session.get('logged_in'):
		user_id = session['user_id']
		json = request.get_json()
		if not PROJECT_NAME_REGEX.match(json['name']):
			return jsonify({'response': 'Invalid name'}), 400
		project = db.projects.find_one_and_update(
			{'user_id': ObjectId(user_id), '_id': ObjectId(id)},
			{'$set': json},
		)
		if project is not None:
			return jsonify({'response': 'OK'})
		else:
			return jsonify({'response': 'Project not found'}), 404
	else:
		return jsonify({'response': 'Not logged in'}), 403

@blueprint.route('/<id>', methods=['DELETE'])
def delete_project(id):
	if session.get('logged_in'):
		user_id = session['user_id']
		project = db.projects.find_one({'user_id': ObjectId(user_id), '_id': ObjectId(id)})
		if project is None:
			return jsonify({'response': 'Project not found'}), 404
		if project.get('environment_id'):
			db.environments.delete_one({'user_id': ObjectId(user_id), '_id': project['environment_id']})
		
		requests.delete("http://{}:4646/v1/job/{}".format(app.config['NOMAD_IP'], id))
		db.projects.delete_one({'user_id': ObjectId(user_id), '_id': ObjectId(id)})
		return jsonify({'response': 'OK'})
	else:
		return jsonify({'response': 'Not logged in'}), 403

@blueprint.route('/<id>/environment/<filename>', methods=['GET'])
def get_project_environment(id, filename):
	try:
		project_id = ObjectId(id)
		project = db.projects.find_one({'_id': project_id})
	
		env = db.environments.find_one({'_id': project['environment_id']})
	
		response = make_response(env['file'])
		response.headers['Content-Type'] = 'application/octet-stream'
		return response
	except Exception:
		return ""


@blueprint.route('/<id>/environment', methods=['POST'])
def upload_project_environment(id):
	if session.get('logged_in'):
		user_id = session['user_id']
		if 'env' not in request.files:
			return jsonify({'response': 'No file submitted'}), 400
		env_file = request.files['env']
		project = db.projects.find_one({'user_id': ObjectId(user_id), '_id': ObjectId(id)})
		if project is None:
			return jsonify({'response': 'Project not found'}), 404
		env_id = project.get('environment_id')
		if env_id is None:
			env_id = db.environments.insert({
				'user_id': ObjectId(user_id),
				'file': Binary(env_file.read())
			})
			db.projects.find_one_and_update(
				{'user_id': ObjectId(user_id), '_id': ObjectId(id)},
				{'$set': {'environment_id': env_id}}
			)
		else:
			db.environments.find_one_and_update(
				{'user_id': ObjectId(user_id), '_id': env_id},
				{'$set': {'file': Binary(env_file.read())}}
			)
		return jsonify({'response': 'OK'}), 200
	else:
		return jsonify({'response': 'Not logged in'}), 403

@blueprint.route('/<id>/environment', methods=['DELETE'])
def remove_project_environment(id):
	if session.get('logged_in'):
		user_id = session['user_id']
		project = db.projects.find_one({'user_id': ObjectId(user_id), '_id': ObjectId(id)})
		if project is None:
			return jsonify({'response': 'Project not found'}), 404
		if project.get('environment_id'):
			db.environments.delete_one({'user_id': ObjectId(user_id), '_id': project['environment_id']})
			db.projects.find_one_and_update(
				{'user_id': ObjectId(user_id), '_id': ObjectId(id)},
				{'$set': {'environment_id': None}}
			)
		
		return jsonify({'response': 'OK'})
	else:
		return jsonify({'response': 'Not logged in'}), 403

@blueprint.route('/<id>/deploy', methods=['POST'])
def deploy_project(id):
	if not session.get("logged_in"):
		return jsonify({'response': 'Not logged in'}), 403

	# Stop old version
	requests.delete("http://{}:4646/v1/job/{}".format(app.config['NOMAD_IP'], id))

	user_id = ObjectId(session['user_id'])
	user = db.users.find_one({'_id': user_id})
	project = db.projects.find_one({'_id': ObjectId(id), 'user_id': user_id})
	name = "{}-{}-{}".format(user['username'], project['name'], "oven-microservice")
	task_name = "{}-{}".format(user['username'], project['name'])
	url_prefix = "/oven/api/{}/{}".format(user['username'], project['name'])
	code_artifact_url = "{}projects/{}/code/app.py".format(app.config['API_URL'], id)
	env_artifact_url = "{}projects/{}/environment/env.zip".format(app.config['API_URL'], id)
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
									"GetterSource": code_artifact_url
								},
								{
									"RelativeDest": "local/",
									"GetterSource": env_artifact_url
								}
							],
							"Services":[
								{
									"Name": name,
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
								"MemoryMB":50,
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
	r = requests.put("http://{}:4646/v1/job/{}".format(app.config['NOMAD_IP'], id), json=job)
	if(r.status_code == 200):
		return jsonify({"response": "Successfully deployed"})
	else:
		return jsonify({"response": r.text})

@blueprint.route("/<id>/deployment", methods=['GET'])
def get_deployment(id):
	if not session.get("logged_in"):
		return jsonify({'response': 'Not logged in'}), 403
	project_id = ObjectId(id)
	r = requests.get("http://{}:4646/v1/job/{}/deployment".format(app.config['NOMAD_IP'], id))
	if(r.status_code == 200):
		return jsonify(r.json())
	else:
		return jsonify(None)

@blueprint.route("/<id>/deployment/alloc", methods=['GET'])
def get_deployment_allocs(id):
	if not session.get("logged_in"):
		return jsonify({'response': 'Not logged in'}), 403
	project_id = ObjectId(id)
	r = requests.get("http://{}:4646/v1/job/{}/allocations".format(app.config['NOMAD_IP'], id))
	if(r.status_code == 200):
		return jsonify(r.json())
	else:
		return jsonify(None)
