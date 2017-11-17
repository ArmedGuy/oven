#!/bin/bash
cd /vagrant/oven-app
au run --watch &

cd /vagrant/oven-api
python3 runserver.py &

echo "servers running..."