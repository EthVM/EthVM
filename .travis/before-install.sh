#!/bin/bash

if [ "$ID" == "apps/server-e2e-test" ]; then

  # Install systemd
  sudo apt-get install systemd

  # Download datasets with Git LFS (if applies)

  echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
  git lfs pull
  git lfs fetch --all

  # Install modern version of Mongo

  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
  echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org

read -r -d '' REPLICA_SET << EOM
replication:
  replSetName: rs0
EOM

  sudo sh -c 'echo "$REPLICA_SET" | tee -a /etc/mongodb.conf'
  sudo service mongod start

  while ! systemctl is-active --quiet mongod; do sleep 1; done

  mongo --eval "rs.initiate()"
  mongo < ./bin/mongo/init.js
  mongorestore -h 127.0.0.1 --port 27017 --db ethvm_local --archive="./datasets/ethvm_mainnet_sample.mongo.archive?raw=true"

fi

# Install jest

yarn global add jest
