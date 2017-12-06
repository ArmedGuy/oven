import os

class DevelopmentConfig:
	DEBUG = True
	SECRET_KEY = os.urandom(24)
	TEMPLATES_AUTO_RELOAD = True
	SESSION_COOKIE_NAME = 'oven_api_session'