#!/bin/bash

wget https://github.com/enKryptIO/ethvm/blob/master/provisioners/docker/config/mongo/ethvm_sample.archive?raw=true
mongo --eval "rs.initiate()"
mongo < ./bin/mongo/init.js
mongorestore -h 127.0.0.1 --port 27017 --db ethvm_local --archive="ethvm_sample.archive?raw=true"
yarn global add jest
