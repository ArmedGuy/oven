from oven import db
from flask import url_for, Blueprint, render_template, request, session, redirect

blueprint = Blueprint('projects', __name__, template_folder='templates')