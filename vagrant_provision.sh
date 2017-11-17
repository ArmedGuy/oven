curl -sL https://deb.nodesource.com/setup_6.x | bash
apt-get update
apt-get install -y nodejs
apt-get install -y build-essential
apt-get install -y python3
apt-get install -y python3-pip
cd /workspace/oven-app
npm install

cd /workspace/oven-api
pip3 install -r requirements.txt