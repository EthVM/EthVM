#!/bin/bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker-compose exec -T mongodb mongo --eval "rs.initiate()"

docker run \
  --rm \
  --network ethvm_back \
  -e MONGODB_URL=mongodb://mongodb:27017/ethvm_local \
  enkryptio/mongodb-ethvm-init:0.1.0
