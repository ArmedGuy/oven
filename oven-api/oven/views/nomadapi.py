import os
from oven import app
from oven import db, bsonify
from datetime import datetime
import nomad


nomad_server = nomad.Nomad(host=app.config['NOMAD_IP'])


def get_job(id):
	return bsonify(nomad_server.job.get_job(id))
	

def register_job(id, job):
	job = request.form['job']
	return bsonify(nomad_server.jobs.register_job(id, job))
	

	









