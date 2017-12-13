import os

from oven import app
from flask import Flask
from oven import db, bsonify
from datetime import datetime
from bson.objectid import ObjectId
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g
from oven.nomadapi import *

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
		
@blueprint.route('/<id>/deploy', methods=['GET'])
def create_job():		
	job = {"job" : {
					  "ID":id,
					  "Name":"test_name",
					  "Type":"test_type",
					  "Priority":50,
					  "Datacenters":[
						 "dh2"
					  ],
					  "TaskGroups":[
						 {
							"Name":"cache",
							"Count":1,
							"Tasks":[
							   {
								  "Name":"redis",
								  "Driver":"docker",
								  "User":"",
								  "Config":{
									 "image":"armedguy/oven-python3flask",
									 "port_map":[
										{
										   "www":80
										}
									 ]
								  },
								  "Services":[
									 {
										"Id":"",
										"Name":id,
										"Tags":[
										   "global",
										   "cache"
										],
										"PortLabel":"www",
										"AddressMode":"",
										"Checks":[
										   {
											  "Id":"",
											  "Name":"",
											  "Type":"tcp",
											  "Command":"",
											  "Path":"",
											  "Protocol":"",
											  "PortLabel":"",
											  "Interval":"",
											  "Timeout":"",
											  "InitialStatus":""
										   }
										]
									 }
								  ],
								  "Resources":{
									 "CPU":500,
									 "MemoryMB":256,
									 "Networks":[
										{
										   "IP":"",
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
							"RestartPolicy":{
							   "Interval":"",
							   "Attempts":"",
							   "Delay":"",
							   "Mode":""
							},
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
				
	return register_job(job)
	

