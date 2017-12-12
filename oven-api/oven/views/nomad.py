import os

import pytest
from oven import app
from flask import Flask
from oven import db, bsonify
from datetime import datetime
from bson.objectid import ObjectId
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g
import nomad

blueprint = Blueprint('nomad', __name__, template_folder='templates')

nomad_server = nomad.Nomad(host=app.config['NOMAD_IP'])

# GET
# List all the enodes
@blueprint.route('/nodes', methods=['GET'])
def get_nodes():
	return bsonify(nomad_server.nodes.get_nodes())
	
# Lists all the members
@blueprint.route('/agents', methods=['GET'])
def get_agent():
	return bsonify(nomad_server.agent.get_members())
	
# This endpoint reads information about a specific deployment by ID.
@blueprint.route('/deploument/<id>', methods=['GET'])
def get_deploument(id):
	return bsonify(nomad_server.deployment.get_deployment(id))
	
# Returns all the deployments
@blueprint.route('/deplouments', methods=['GET'])
def get_deplouments():
	return bsonify(nomad_server.deployments.get_deployments())
	
# This endpoint lists the allocations created or modified for the given deployment.
@blueprint.route('/deploument/<id>/allocations', methods=['GET'])
def get_deploument_allocations(id):
	return bsonify(nomad_server.deployment.get_deployment_allocations(id))

	fail_deployment
	
# POST

# This endpoint is used to mark a deployment as failed. 
# This should be done to force the scheduler to stop creating 
# allocations as part of the deployment or to cause a rollback 
# to a previous job version.
@blueprint.route('/deploument/<id>/fail_deployment', methods=['POST'])
def fail_deployment(id):
	return bsonify(nomad_server.deployment.fail_deployment(id))

# This endpoint is used to pause or unpause a deployment. 
# This is done to pause a rolling upgrade or resume it.
@blueprint.route('/deploument/<id>/pause_deployment', methods=['POST'])
def pause_deploymentv(id):
	return bsonify(nomad_server.deployment.pause_deployment(id))
	
# This endpoint is used to promote task groups that have canaries for a deployment. 
# This should be done when the placed canaries are healthy and the rolling upgrade 
# of the remaining allocations should begin.
@blueprint.route('/deploument/<id>/promote_deployment_all', methods=['POST'])
def promote_deployment_all(id):
	return bsonify(nomad_server.deployment.promote_deployment_all(id))	
	

# This endpoint is used to promote task groups that have canaries for a deployment. 
# This should be done when the placed canaries are healthy and the rolling upgrade 
# of the remaining allocations should begin.
@blueprint.route('/deploument/<id>/promote_deployment_groups', methods=['POST'])
def promote_deployment_groups(id):
	return bsonify(nomad_server.deployment.promote_deployment_groups(id))
	
# This endpoint is used to set the health of an allocation that is in the deployment manually. 
# In some use cases, automatic detection of allocation health may not be desired. 
# As such those task groups can be marked with an upgrade policy that uses health_check = "manual". 
# Those allocations must have their health marked manually using this endpoint. 
# Marking an allocation as healthy will allow the rolling upgrade to proceed. 
# Marking it as failed will cause the deployment to fail.
@blueprint.route('/deploument/<id>/deployment_allocation_health', methods=['POST'])
def deployment_allocation_health(id):
	return bsonify(nomad_server.deployment.deployment_allocation_health(id))
	#return bsonify(nomad_server.deployment.deployment_allocation_health(id, healthy_allocations=list(), unhealthy_allocations=list()))
	
	












