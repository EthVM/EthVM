#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

echo "Building containers..."
CMD="docker-compose build"
echo "Executing: ${CMD}"
${CMD}

echo "Starting up containers: traefik, kafka and mongo"
CMD="docker-compose up -d traefik kafka mongodb"
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
