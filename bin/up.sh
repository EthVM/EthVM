#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

echo "Starting up containers: traefik, kafka, mongo, ethvm and server"
CMD="docker-compose up -d --build"
echo "Executing: ${CMD}"
${CMD}

echo "Waiting 15 seconds to allow previous docker containers initialisation..."
sleep 15

echo "Creating kafka topics..."
CMD="${SCRIPT_DIR}/kafka/init.sh"
echo "Executing: ${CMD}"
${CMD}

echo "Initialisation of mongo"
CMD="${SCRIPT_DIR}/mongo/init.sh"
echo "Executing: ${CMD}"
${CMD}

echo "Registering avro schemas"
CMD="${SCRIPT_DIR}/avro/register-schemas.sh"
echo "Executing: ${CMD}"
${CMD}
