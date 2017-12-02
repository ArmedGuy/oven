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
Make shure you execute the following command if you are developing on windows:
```bash
git config --global core.autocrlf false
```
Otherwise the .sh files will not work when you clone the repo.