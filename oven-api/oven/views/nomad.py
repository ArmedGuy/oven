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

# deployment/s
# List all the enodes
@blueprint.route('/nodes', methods=['GET'])
def get_nodes():
	return bsonify(nomad_server.nodes.get_nodes())
	
# Lists all the members
@blueprint.route('/agents', methods=['GET'])
def get_agent():
	return bsonify(nomad_server.agent.get_members())
	
# This endpoint reads information about a specific deployment by ID.
@blueprint.route('/deployment/<id>', methods=['GET'])
def get_deployment(id):
	return bsonify(nomad_server.deployment.get_deployment(id))
	
# This endpoint lists all deployments.
@blueprint.route('/deployments', methods=['GET'])
def get_deployments():
	return bsonify(nomad_server.deployments.get_deployments())
	
# This endpoint lists the allocations created or modified for the given deployment.
@blueprint.route('/deployment/<id>/allocations', methods=['GET'])
def get_deployment_allocations(id):
	return bsonify(nomad_server.deployment.get_deployment_allocations(id))
	
# Job/s
# Lists all the jobs registered with Nomad.
@blueprint.route('/jobs', methods=['GET'])
def get_jobs():
	return bsonify(nomad_server.jobs.get_jobs())
	
# Query a single job for its specification and status.
@blueprint.route('/job/<id>', methods=['GET'])
def get_job(id):
	return bsonify(nomad_server.jobs.get_job(id))
	
# Query a single job for its specification and status.
@blueprint.route('/job/<id>/versions', methods=['GET'])
def get_versions(id):
	return bsonify(nomad_server.jobs.get_versions(id))
	
# Query the allocations belonging to a single job.
@blueprint.route('/job/<id>/allocations', methods=['GET'])
def get_allocations(id):
	return bsonify(nomad_server.jobs.get_allocations(id))
	
# Query the evaluations belonging to a single job.
@blueprint.route('/job/<id>/evaluations', methods=['GET'])
def get_evaluations(id):
	return bsonify(nomad_server.jobs.get_evaluations(id))
	
# This endpoint lists a single job's deployments
@blueprint.route('/job/<id>/deployments', methods=['GET'])
def get_deployments_by_id(id):
	return bsonify(nomad_server.jobs.get_deployments(id))

# This endpoint returns a single job's most recent deployment.
@blueprint.route('/job/<id>/deployment', methods=['GET'])
def get_deployment_by_id(id):
	return bsonify(nomad_server.jobs.get_deployment(id))
	
# Query the summary of a job.
@blueprint.route('/job/<id>/summary', methods=['GET'])
def get_summary(id):
	return bsonify(nomad_server.jobs.get_summary(id))
	
# System
# Initiate garbage collection of jobs, evals, allocations and nodes.
@blueprint.route('/system/garbage_collection', methods=['GET'])
def initiate_garbage_collection():
	return bsonify(nomad_server.system.initiate_garbage_collection())
	

	
	
# POST

# deployment/s
# This endpoint is used to mark a deployment as failed. 
# This should be done to force the scheduler to stop creating 
# allocations as part of the deployment or to cause a rollback 
# to a previous job version.
@blueprint.route('/deployment/<id>/fail_deployment', methods=['POST'])
def fail_deployment(id):
	return bsonify(nomad_server.deployment.fail_deployment(id))

# This endpoint is used to pause or unpause a deployment. 
# This is done to pause a rolling upgrade or resume it.
@blueprint.route('/deployment/<id>/pause_deployment', methods=['POST'])
def pause_deploymentv(id):
	return bsonify(nomad_server.deployment.pause_deployment(id))
	
# This endpoint is used to promote task groups that have canaries for a deployment. 
# This should be done when the placed canaries are healthy and the rolling upgrade 
# of the remaining allocations should begin.
@blueprint.route('/deployment/<id>/promote_deployment_all', methods=['POST'])
def promote_deployment_all(id):
	return bsonify(nomad_server.deployment.promote_deployment_all(id))	
	

# This endpoint is used to promote task groups that have canaries for a deployment. 
# This should be done when the placed canaries are healthy and the rolling upgrade 
# of the remaining allocations should begin.
@blueprint.route('/deployment/<id>/promote_deployment_groups', methods=['POST'])
def promote_deployment_groups(id):
	return bsonify(nomad_server.deployment.promote_deployment_groups(id))
	
# This endpoint is used to set the health of an allocation that is in the deployment manually. 
# In some use cases, automatic detection of allocation health may not be desired. 
# As such those task groups can be marked with an upgrade policy that uses health_check = "manual". 
# Those allocations must have their health marked manually using this endpoint. 
# Marking an allocation as healthy will allow the rolling upgrade to proceed. 
# Marking it as failed will cause the deployment to fail.
@blueprint.route('/deployment/<id>/deployment_allocation_health', methods=['POST'])
def deployment_allocation_health(id):
	return bsonify(nomad_server.deployment.deployment_allocation_health(id))
	#return bsonify(nomad_server.deployment.deployment_allocation_health(id, healthy_allocations=list(), unhealthy_allocations=list()))
	
	
# Job/s
# Registers a new job or updates an existing job.
@blueprint.route('/job/<id>/register', methods=['POST'])
def register_job(id):
	job = request.form['job']
	return bsonify(nomad_server.jobs.register_job(id, job))
	
# Creates a new evaluation for the given job. 
# This can be used to force run the scheduling logic if necessary.
@blueprint.route('/job/<id>/evaluate', methods=['POST'])
def evaluate_job(id):
	return bsonify(nomad_server.jobs.evaluate_job(id))
	
# Invoke a dry-run of the scheduler for the job.
@blueprint.route('/job/<id>/plan', methods=['POST'])
def plan_job(id):
	job = request.form['job']
	diff = request.form['diff']
	return bsonify(nomad_server.jobs.plan_job(id, job, diff))
	
# Forces a new instance of the periodic job. 
# A new instance will be created even if it violates the job's prohibit_overlap settings. 
# As such, this should be only used to immediately run a periodic job.
@blueprint.route('/job/<id>/periodic', methods=['POST'])
def periodic_job(id):
	return bsonify(nomad_server.jobs.periodic_job(id))
	
# Dispatches a new instance of a parameterized job.
@blueprint.route('/job/<id>/dispatch', methods=['POST'])
def dispatch_job(id):
	payload = request.form['payload']
	meta = request.form['meta']
	return bsonify(nomad_server.jobs.dispatch_job(id, payload, meta))
	
# This endpoint reverts the job to an older version.
@blueprint.route('/job/<id>/revert', methods=['POST'])
def revert_job(id):
	version = request.form['version']
	return bsonify(nomad_server.jobs.revert_job(id, version))
	
# This endpoint sets the job's stability.
@blueprint.route('/job/<id>/stable', methods=['POST'])
def stable_job(id):
	version = request.form['version']
	stable = request.form['stable']
	return bsonify(nomad_server.jobs.stable_job(id, version, stable))
	
# Deregisters a job, and stops all allocations part of it.
@blueprint.route('/job/<id>/deregister', methods=['POST'])
def deregister_job(id):
	return bsonify(nomad_server.jobs.deregister_job(id))
	
	
	









