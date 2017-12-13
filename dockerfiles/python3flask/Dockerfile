FROM python:3.6.0

ENV RUNDIR /app
RUN mkdir -p /app
COPY requirements.txt /app/requirements.txt
COPY app.py /app/app.py
WORKDIR /
RUN pip3 install -r /app/requirements.txt

EXPOSE 80

ENTRYPOINT ["python3", "/app/app.py"]