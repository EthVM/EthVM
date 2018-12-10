#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

MONGO="docker-compose exec -T mongodb mongo"

${MONGO} < ${SCRIPT_DIR}/reset.js
