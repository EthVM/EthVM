#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

MONGO="docker-compose exec -T mongodb mongo"
SCRIPT=$(cat ${SCRIPT_DIR}/init.js)

${MONGO} --eval "rs.initiate()"

sleep 5

${MONGO} < ${SCRIPT_DIR}/init.js
