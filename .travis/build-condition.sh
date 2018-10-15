#!/bin/bash

echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
git lfs pull

mongo --eval "rs.initiate()"
mongo < ./bin/mongo/init.js
mongorestore -h 127.0.0.1 --port 27017 --db ethvm_local --archive="./datasets/ethvm_mainnet_sample.mongo.archive?raw=true"

yarn global add jest
