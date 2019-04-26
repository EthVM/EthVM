#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# source env to get platform specific docker compose command
source ${SCRIPT_DIR}/env.sh

version=$(read_version migrator)

docker run --rm \
  --network ethvm_back \
  -e FLYWAY_JDBC_URL=${JDBC_URL} \
  -e FLYWAY_USER=${FLYWAY_USER} \
  -e FLYWAY_PASSWORD=${FLYWAY_PASSWORD} \
  -e FLYWAY_CONNECT_RETRIES=5 \
  ethvm/migrator:${version} "$@"
