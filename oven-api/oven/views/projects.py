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

blueprint = Blueprint('projects', __name__, template_folder='templates')

# Used to create a project
@blueprint.route('/create/<project>', methods=['POST'])
def create(project):
	
	# Should verify session here...
	
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
		shortName = request.form['shortName']
	except:
		return "ERROR, no shortName defined!"
	try:
		description = request.form['description']
	except:
		return "ERROR, no description defined!"
	try:
		shortDescription = request.form['shortDescription']
	except:
		return "ERROR, no shortDescription defined!"
	try:
		codeFile = request.form['codeFile']
	except:
		return "ERROR, no codeFile defined!"
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
	
	# Submit to database before return
	db.projects.insert({'software_id':software_id,'platform_id':platform_id,'shortName':shortName,'description':description,'shortDescription':shortDescription,'codeFile':codeFile,'dependencies':dependencies,'revision':revision,'create_date':create_date})
	
	return "Success!!\n" + project + " created on " + dumps(create_date) + "!\n"

	
# Used to create a project
@blueprint.route('/get_projects/', methods=['GET'])
def get_projects():
	return dumps(db.projects.find())
