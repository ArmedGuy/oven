class DevelopmentConfig:
	DEBUG = True
	SECRET_KEY = "I\xcfg\x06\xd9Y\x00\xd4\xbd\x92\x83\xf4S\xa9\x04\xff\xb3\x9b\xef\x88\x14\xf5\xc2R"
	TEMPLATES_AUTO_RELOAD = True
	SESSION_COOKIE_NAME = 'oven_api_session'
	SESSION_COOKIE_HTTPONLY = False
	NOMAD_IP = '130.240.16.191'
	NOMAD_PORT = 8301
	APPLICATION_ROOT = "/api"
	FRONTEND_URL = "http://localhost:9000/"
	API_URL = "http://localhost:5555/api/"
	CAS_SERVICE = "http://localhost:5555/account/session/authenticate"
