#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

echo "Building containers: ethvm, server"
CMD="docker-compose build ethvm server"
echo "Executing: ${CMD}"
${CMD}

echo "Starting up containers: traefik, mongo, ethvm, server"
CMD="docker-compose up -d traefik mongodb ethvm server"
echo "Executing: ${CMD}"
${CMD}

echo "Waiting 10 seconds to allow previous docker containers initialisation..."
sleep 15

echo "Initialisation of mongo"
CMD="${SCRIPT_DIR}/mongo/init.sh"
echo "Executing: ${CMD}"
${CMD}

echo "Importing bootstraped db to mongo..."
CMD="mongorestore --db ethvm_local --archive=\"ethvm_sample.archive\""
echo "Executing: ${CMD}"
docker-compose exec mongodb sh -c "$CMD"
