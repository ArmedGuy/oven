import os

class DevelopmentConfig:
	DEBUG = True
	SECRET_KEY = os.urandom(24)