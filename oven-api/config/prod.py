class ProductionConfig:
	DEBUG = False
	SECRET_KEY = "@\x0e\xf1t\x15{\xa1x\xc2\xfb\xba\x01\xc5\xc0\x1b\x05\x0b+@\x0eT?\xbb\x1b"
	TEMPLATES_AUTO_RELOAD = False
	SESSION_COOKIE_NAME = 'oven_api_session'
	SESSION_COOKIE_HTTPONLY = False
	CAS_SERVICE = "http://bulbasaur.campus.ltu.se/api/account/session/authenticate"
	NOMAD_IP = '130.240.16.191'
	NOMAD_PORT = 8301