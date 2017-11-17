curl -sL https://deb.nodesource.com/setup_6.x | bash
apt-get update
apt-get upgrade
apt-get install -y nodejs
apt-get install -y build-essential
apt-get install -y python3 python3-pip
apt-get install -y redis-server
cd /vagrant/oven-app
npm install -g aurelia-cli
npm install --no-bin-links

cd /vagrant/oven-api
pip3 install -r requirements.txt