#!/usr/bin/env bash

# Update ubuntu
/vagrant/ubuntu.sh

# Install nodejs
./nodejs.sh

# Build and install CouchDB from source
/vagrant/couchdb.sh

# Install app
sudo -u ubuntu /vagrant/app.sh
