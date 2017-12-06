import os

class ProductionConfig:
	DEBUG = False
	SECRET_KEY= os.urandom(24)