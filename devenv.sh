#!/bin/bash
cd /vagrant/oven-app
au run --watch &

cd /vagrant/oven-api
FLASK_DEBUG=1 python3 runserver.py &
#python3 runserver.py&

echo "servers running..."
