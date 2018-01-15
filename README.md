# Oven
Oven is a tool for creating and learning about microservices. It assists users in learning how to design microservices,
and takes full care in deploying microservices to different microservices clusters.

By using incorporating a building-block-like coding experience with a regular code editor, it lets the users focus on
building logic for their microservices rather than learning how to write boring boilerplate code.

##### Link to server
http://bulbasaur.campus.ltu.se

## Development

### Setting up with [Vagrant](http://vagrantup.com)
Install Vagrant and Virtualbox on your system.
Then enter this repository and run vagrant up.
It will download an Ubuntu 16.04 image and set up all dependencies needed for developing/running the development code.

You can then enter the VM with `vagrant ssh`, cd to `/vagrant`, and run `./devenv.sh`, to start autorestartable dev servers for both `oven-api` and `oven-app`.

### Setting up oven-api for development

The oven-api Flask project is developed via Visual Studio, hence the extra clutter of project files.
Development can be made without Visual Studio, but some desync between folder structure and the .pyproj is to be expected.

To run the server in dev mode, simply install all dependencies in the requirements.txt file, then run `python3 runserver.py`.

### Setting up oven-app for development
The `oven-app` project uses the [Aurelia framework](http://aurelia.io/) for client side development, using TypeScript.
It is, as most JavaScript-based projects, filled with dependencies, including nodejs and npm.

Enter the oven-app folder and run `npm install`. This will download all dependencies (mostly dev deps), including the `aurelia-cli`.

Development is accomplished by starting the builtin aurelia web server, that helps you debug and build the application.
Run the server with `au run --watch`.

## Deployment
This project uses [Travis CI](http://travis-ci.org) for continous integration testing and deployment.
Whenver something is pushed to master, a docker image is built and pushed to [Docker hub](http://dockerhub.com/armedguy/oven), so that things can be continously released.

## Developing on Windows
Make sure you execute the following command if you are developing on windows:
```bash
git config --global core.autocrlf false
```
Otherwise the .sh files will not work when you clone the repo.

## Production
The easiest way to deploy Oven is by using the Docker image that is built automatically. It can be found [here](http://dockerhub.com/armedguy/oven).

Simply run `docker run -d -p 80:80 -v /opt/oven/data:/data --name oven armedguy/oven:latest` to start a new instance, but make sure that /opt/oven/data exists first.
The volume is mounted to allow for MongoDB to store its data outside of the container.





## API Documentation

### **GET** `/api/account/session`
Fetch currently logged in user, if any.

Returns a user object with HTTP 200 if logged in, or null otherwise.

<hr>
### **GET** `/api/account/session/authenticate`
Callback URL for CAS authentication requests. Should be set as the CAS service URL when making a CAS login attempt.

Returns a session cookie if login was successful, and redirects to the primary frontend URL.
<hr>
### **POST** `/api/account/session/logout`
Logs the user out of a session.

<hr>
### **POST** `/api/projects`
Create a new project as a logged in user.

Expects a JSON object with the following data:
```
{
    "name": "example",
    "software_id": "python3flask", // only available now
    "platform_id": "nomad" // only available now
}
```
Returns a project object if the project was successfully created, or a non-200 answer if something went wrong.

<hr>
### **GET** `/api/projects`
Returns a list of projects for the currently logged in user.

Returns an array of project objects.

<hr>
### **GET** `/api/projects/<int:id>`
Get a specific project that is tied to the currently logged in user.

Returns a project object, or a non-200 response if something went wrong.
<hr>
### **PUT** `/api/projects/<int:id>`
Save a project with new data.

Expects a project object with new data to save.

Returns the new project object if successful, and a non-200 response if something went wrong.
<hr>
### **DELETE** `/api/projects/<int:id>`
Delete a project specified by an id, and a user_id (derived from the session).
END DOCS""
<hr>
### **GET** `/api/projects/<int:id>/code/<filename>`
Fetch the code file for a project.

The code file is a complete, runnable file that contains the whole microservice.
The filename parameter in the URL is only used by the Nomad cluster to name the file it downloads so that it can store it, in all other cases it is considered a dummy variable.
<hr>
### **GET** `/api/projects/<int:id>/environment/<filename>`
Fetch the environment file for a project.

The environment file is a .zip archive containing extra files that are needed by the microservice to run.
For example, one can add a requirements.txt to the .zip file if additional pip dependencies are needed.
The filename parameter in the URL is only used by the Nomad cluster to name the file it downloads so that it can store it, in all other cases it is considered a dummy variable.
<hr>
### **POST** `/api/projects/<int:id>/environment`
Upload a new environment file to a project.

The environment file is a .zip archive containing extra files that are needed by the microservice to run.
For example, one can add a requirements.txt to the .zip file if additional pip dependencies are needed.

Expects a form-data encoded POST request with a single file in a variable called `env`. The file should be a .zip-file.

Returns a HTTP 200 response if the upload was successful, or a non 200 response if something went wrong.
<hr>
### **DELETE** `/api/projects/<int:id>/environment`
Clear the environment file for a project.

The environment file is a .zip archive containing extra files that are needed by the microservice to run.
For example, one can add a requirements.txt to the .zip file if additional pip dependencies are needed.

Returns a HTTP 200 response if the environment was cleared, or a non 200 response if something went wrong.
<hr>
### **POST** `/api/projects/<int:id>/deploy`
Deploy the current state of a project to a platform.

Returns HTTP 200 if a deployment was successfully scheduled, or a non 200 response if something went wrong.
<hr>
### **GET** `/api/projects/<int:id>/deployment`
Gets underlying Nomad data for a project's current deployment status.

Returns a Nomad deployment object in JSON.
<hr>
### **GET** `/api/projects/<int:id>/deployment/alloc`
Gets underlying Nomad data for a project's current allocation status, and events.

Returns a list of Nomad allocation objects in JSON.
<hr>
