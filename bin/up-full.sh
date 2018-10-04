#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

${SCRIPT_DIR}/up.sh

echo "Starting up container: ethereumj"
CMD="docker-compose up -d ethereumj"
echo "Executing: ${CMD}"
${CMD}

echo "Waiting 15 secs to allow ethereumj to compile (but it will take a lot more than that...)"
sleep 15

echo "Starting up container: bolt"
CMD="docker-compose up -d bolt"
echo "Executing: ${CMD}"
${CMD}
