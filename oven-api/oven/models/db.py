from oven import db

class User(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    username = db.Column(db.Strng(32), unique=True)
    email = db.Column(db.String(128), unique=True)
    req_date = db.Column(db.DateTime)

	class Project(db.Model):
		id = db.Column(db.String(32), primary_key=True)
		user_id = db.Column(db.Integer(16), nullable=True)
		software_id = db.Column(db.VARCHAR(32))
		platform_id = db.Column(db.VARCHAR(32))
		shortName = db.Column(db.Text,unique=True)
		description = dc.Column(db.Text)
		shortDescription = db.Column(db.Text)
		codeFile = db.Column(db.Text)
		dependencies = db.Column(dc.Text)
		revision = db.Column(db.Text)
		req_date = db.Column(db.DateTime)