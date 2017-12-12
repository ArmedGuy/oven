import os
import urllib
import urllib.request
from oven import app, db, bsonify
from datetime import datetime
from bson.objectid import ObjectId
from flask import url_for, Blueprint, render_template, request, session, redirect, jsonify, g
from lxml import etree

blueprint = Blueprint('account', __name__, template_folder='templates')

@blueprint.route('/session', methods=["GET"])
def get_session():
	if session.get('logged_in'):
		user = db.users.find_one({ "_id": ObjectId(session['user_id'])})
		return bsonify(user)
	else:
		return jsonify(None)
	
@blueprint.route('/session/authenticate', methods=["GET"])
def verify():
	ticket = request.args.get("ticket")
	service = app.config['CAS_SERIVCE']
	if not ticket:
		return redirect("/")
	f = urllib.request.urlopen("https://weblogon.ltu.se/cas/serviceValidate?ticket={}&service={}".format(ticket, service))
	tree = etree.parse(f)
	if tree.getroot()[0].tag.endswith("authenticationSuccess"):
		ideal = tree.getroot()[0][0].text
		email = ""
		if "-" in ideal:
			email = "%s@student.ltu.se" % ideal
		else:
			email = "%s@ltu.se"
		
		existing_email = db.users.find_one({'email': email})
		if existing_email is None:
			session['user_id'] = db.users.insert({
				'email': email,
				'username': ideal,
				'created_date': datetime.now()
			})
		else:
			session['user_id'] = str(existing_email['_id'])
		session['logged_in'] = True
		return redirect("http://localhost:9000")
	else:
		return redirect("/error") # TODO: actually return to some error page
		
@blueprint.route('/session/logout', methods=["GET"])
def logout():
	if session.get("logged_in"):
		session['logged_in'] = False
	return redirect("/")
	
	
@blueprint.route('/register', methods=["POST"])
def register():
	if request.method == 'POST':
		tmp_mail = request.form['mail'].split("@")
		if len(tmp_mail) >= 2 and len(tmp_mail[1].split(".")) >= 2 :
	
			existing_user = db.users.find_one({'user' : request.form['user']})
			existing_mail = db.users.find_one({'mail' : request.form['mail']})
			
			if existing_user is not None:
				return "{'response':'Error, user exists!'}"
			elif existing_mail is not None:
				return "{'response':'Error, mail exists!'}"
			else:
				session.pop('data', None)
				
				try:
					db.users.insert({'user':request.form['user'],'mail':request.form['mail'],'create_date':datetime.now()})
					session['user'] = request.form['user']
					session['mail'] = request.form['mail']
					return "{'response':'Sucess, welcome to oven!'}"
				except:
					return "{'response':'Error, could not create user!'}"
		else:
				return "{'response':'Enter a valid mail!'}"				
	else:
		return "{'tesponse':'Error, use POST and send user and mail'}"
		
	
	
	
### The blueprints bellow will be removed @ a later date, used 4 testing...
@blueprint.route('/', methods=["POST"])
def add_user():
	users = []
	for x in db.users.find():
		users.append(x)
	return dumps(users)
	

@blueprint.route('/<id>', methods=["GET"])
def get_user(id):
	try:
		return id
	except:
		return "ERROR!"

	