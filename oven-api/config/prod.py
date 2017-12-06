import os

class ProductionConfig:
	DEBUG = False
	SECRET_KEY = os.urandom(24)
	TEMPLATES_AUTO_RELOAD = False
	SESSION_COOKIE_NAME = 'oven_api_session'