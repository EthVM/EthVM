#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

if [ "$ID" == "apps/server-e2e-test" ]; then

  # Download datasets with Git LFS (if applies)

  echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
  git lfs fetch --all
  git lfs checkout

  # Install modern version of Mongo

  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
  echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org

  sudo mkdir -p /data/db
  sudo mongod --bind_ip 127.0.0.1 --quiet &>/dev/null &
  mongorestore --host 127.0.0.1 --port 27017 --archive="${ROOT_DIR}/datasets/ethvm_mainnet_sample.mongo.archive"
  sudo kill -9 $(pgrep mongod)

  sudo mongod --bind_ip 0.0.0.0 --replSet rs0 --quiet --slowms 10000 &>/dev/null &
  sleep 10
  mongo --eval "rs.initiate()"
  mongo < ./bin/mongo/init.js

fi

# Install jest

yarn global add jest
