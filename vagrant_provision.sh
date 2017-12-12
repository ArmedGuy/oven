curl -sL https://deb.nodesource.com/setup_6.x | bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y nodejs
apt-get install -y build-essential
apt-get install -y python3 python3-pip
apt-get install -y redis-server
apt-get install -y docker-ce

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
sudo echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
pip install Flask-PyMongo
pip install Flask-Session
pip install python-nomad
pip install -U pytest

cd /vagrant/oven-app
npm install -g aurelia-cli
npm install --no-bin-links

usermod -aG docker vagrant

cd /vagrant/oven-api
pip3 install -r requirements.txt
