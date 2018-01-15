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
	if session.get('logged_in'):
		return redirect(app.config['FRONTEND_URL'])
	ticket = request.args.get("ticket")
	service = app.config['CAS_SERVICE']
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
			session['user_id'] = str(db.users.insert({
				'email': email,
				'username': ideal,
				'created_date': datetime.now()
			}))
		else:
			session['user_id'] = str(existing_email['_id'])
		session['logged_in'] = True
		return redirect(app.config['FRONTEND_URL'])
	else:
		return redirect("/error") # TODO: actually return to some error page
		
@blueprint.route('/session/logout', methods=["GET"])
def logout():
	if session.get("logged_in"):
		session['logged_in'] = False
	return redirect("/")