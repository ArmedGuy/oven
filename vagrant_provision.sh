curl -sL https://deb.nodesource.com/setup_6.x | bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y nodejs
apt-get install -y build-essential
apt-get install -y python3 python3-pip
apt-get install -y redis-server
apt-get install -y docker-ce
cd /vagrant/oven-app
npm install -g aurelia-cli
npm install --no-bin-links

usermod -aG docker vagrant

cd /vagrant/oven-api
pip3 install -r requirements.txt