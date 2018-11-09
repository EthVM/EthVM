#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

DATASET="ethvm_mainnet_sample.mongo.archive"

echo "Starting up containers: traefik, mongo, redis ethvm and server"
CMD="docker-compose up -d --build traefik mongodb redis ethvm server"
echo "Executing: ${CMD}"
${CMD}

echo -e "\nWaiting 10 seconds to allow previous docker containers initialisation...\n"
sleep 10

echo "Initialisation of mongo"
CMD="${SCRIPT_DIR}/mongo/init.sh"
echo "Executing: ${CMD}"
${CMD}

echo "Importing bootstraped db to mongo..."
git lfs fetch --all
CMD="mongorestore --archive=\"/datasets/${DATASET}\""
echo "Executing: ${CMD}"
docker-compose exec mongodb sh -c "$CMD"
