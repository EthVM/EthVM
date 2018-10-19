#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

echo "Starting up containers: traefik, mongo, redis ethvm and server"
CMD="docker-compose up -d --build traefik mongodb redis ethvm server"
echo "Executing: ${CMD}"
${CMD}

echo "Waiting 10 seconds to allow previous docker containers initialisation..."
sleep 10

echo "Initialisation of mongo"
CMD="${SCRIPT_DIR}/mongo/init.sh"
echo "Executing: ${CMD}"
${CMD}

echo "Importing bootstraped db to mongo..."
CMD="mongorestore --db ethvm_local --archive=\"/datasets/ethvm_mainnet_sample.mongo.archive\""
echo "Executing: ${CMD}"
docker-compose exec mongodb sh -c "$CMD"

echo "Everything done! Wait for ethvm and server containers to be ready..."
