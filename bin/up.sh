#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# create containers
echo "Building containers..."
CMD="docker-compose build"
echo "Executing: ${CMD}"
${CMD}

echo "Starting up containers: traefik, zookeeper, kafka, kafka-schema-registry and mongo"
CMD="docker-compose up -d traefik kafka-schema-registry mongodb"
echo "Executing: ${CMD}"
${CMD}

echo "Waiting 15 seconds to allow docker services initialisation..."
sleep 15

CMD="${SCRIPT_DIR}/kafka/init.sh"
echo "Executing: ${CMD}"
${CMD}

CMD="${SCRIPT_DIR}/mongo/init.sh"
echo "Executing: ${CMD}"
${CMD}

echo "Starting ethereumj container..."
CMD="docker-compose up -d ethereumj"
echo "Executing: ${CMD}"
${CMD}
