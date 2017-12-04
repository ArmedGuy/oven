from oven import db

class Group(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.Strng(32), unique=True)
    members = db.Column(db.String(512))


class Project(db.Model):
    id = db.Column(db.String(32), primary_key=True)

    userID = db.Column(db.Integer(16), nullable=True)
    groupID = db.Column(db.Integer(16), nullable=True)
    softwareID = db.Column(db.VARCHAR(32))
    platformID = db.Column(db.VARCHAR(32))

    shortName = db.Column(db.Text,unique=True)
    description = dc.Column(db.Text)
    shortDescription = db.Column(db.Text)
    
    codeFile = db.Column(db.Text)
    dependencies = db.Column(dc.Text)

    revision = db.Column(db.Text)
    req_date = db.Column(db.DateTime)


class User(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    username = db.Column(db.Strng(32), unique=True)
    password = db.Column(db.VARCHAR(64))
    email = db.Column(db.String(128), unique=True)
    req_date = db.Column(db.DateTime)


class UserSettings(db.Model):
    id = db.Column(db.String(32), primary_key=True)
    username = db.Column(db.Strng(32), unique=True)
    password = db.Column(db.VARCHAR(64))
    email = db.Column(db.String(128), unique=True)
    req_date = db.Column(db.DateTime)

