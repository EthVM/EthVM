#!/bin/bash

# Download datasets with Git LFS

echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
git lfs pull
git lfs fetch --all

# Prepare properly Mongo in ReplicaSet

sudo service mongodb stop
sudo sh -c 'echo "replSet = rs0" | tee -a /etc/mongodb.conf'
sudo service mongodb restart
sleep 10
mongo --eval "rs.initiate()"
mongo < ./bin/mongo/init.js
mongorestore -h 127.0.0.1 --port 27017 --db ethvm_local --archive="./datasets/ethvm_mainnet_sample.mongo.archive?raw=true"

# Install jest

yarn global add jest
