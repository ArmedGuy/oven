from flask import url_for, Blueprint, render_template, request, session, redirect

blueprint = Blueprint('account', __name__, template_folder='templates')