#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# source env to get platform specific docker compose command
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# source docker compose env variables
source ${ROOT_DIR}/.env

version=$(read_version migrator)

NETWORK=${NETWORK:-ethvm_net}

FLYWAY_LOCATIONS="filesystem:/flyway/migrations"
FLYWAY_URL=${JDBC_URL}

docker run --rm \
  --network ${NETWORK} \
  -e FLYWAY_URL=${FLYWAY_URL} \
  -e FLYWAY_LOCATIONS=${FLYWAY_LOCATIONS} \
  ethvm/migrator:${version} "$@"
