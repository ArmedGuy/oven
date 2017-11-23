FROM ubuntu:16.04

RUN apt update -y && apt install -y apt-utils curl

RUN apt-get update && apt-get -y install build-essential python3 python3-pip nginx
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