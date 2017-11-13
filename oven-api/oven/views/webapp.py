from oven import db
from flask import url_for, Blueprint, render_template, request, session, redirect

blueprint = Blueprint('webapp', __name__, template_folder='templates')


@blueprint.route("/", methods=["GET"])
def landing_index():
    return render_template("landing.html")

@blueprint.route("/app", methods=["GET"])
def app_index():
    return render_template("webapp.html")