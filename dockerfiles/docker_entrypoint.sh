#!/bin/bash

nginx
cd /opt/oven/api
uwsgi --ini oven.ini