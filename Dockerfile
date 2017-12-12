FROM ubuntu:16.04

RUN sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
RUN echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
RUN apt-get update && apt-get -y install build-essential python3 python3-pip nginx mongodb-org

ENV RUNDIR /opt/oven
RUN mkdir -p ${RUNDIR}/app
RUN mkdir -p ${RUNDIR}/api
COPY oven-app/index.html ${RUNDIR}/app/index.html
COPY oven-app/scripts/ ${RUNDIR}/app/scripts/
COPY oven-api/ ${RUNDIR}/api/
COPY dockerfiles/default-nginx /etc/nginx/sites-available/default
COPY dockerfiles/docker_entrypoint.sh /docker_entrypoint.sh
WORKDIR ${RUNDIR}/api/
RUN pip3 install -r requirements.txt
WORKDIR ${RUNDIR}/

EXPOSE 80

ENTRYPOINT ["/docker_entrypoint.sh"]