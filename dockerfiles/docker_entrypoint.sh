#!/bin/bash

nginx
mkdir -p /data/db
mongod --fork --logpath /var/log/mongodb.log
cd /opt/oven/api
python3 runserver.py
