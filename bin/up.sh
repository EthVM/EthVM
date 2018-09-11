#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# create containers

CMD="docker-compose up -d --build --remove-orphans"

echo "Executing: ${CMD}"
${CMD}

echo "Waiting 15 seconds to allow service initialisation..."
sleep 15

CMD="${SCRIPT_DIR}/kafka/init.sh"
echo "Executing: ${CMD}"
${CMD}

CMD="${SCRIPT_DIR}/mongo/init.sh"
echo "Executing: ${CMD}"
${CMD}

echo "Restarting some services"
CMD="${SCRIPT_DIR}/restart.sh geth"
echo "Executing: ${CMD}"
${CMD}



