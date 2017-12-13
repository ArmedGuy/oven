#!/bin/bash

nginx
mkdir -p /data/db
mongod --fork --logpath /var/log/mongodb.log
cd /opt/oven/api
uwsgi --ini oven.ini