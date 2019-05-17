#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# source env to get platform specific docker compose command
source ${SCRIPT_DIR}/env.sh

version=$(read_version migrator)

docker run --rm \
  --network ethvm_back \
  -e POSTGRES_JDBC_URL=${POSTGRES_JDBC_URL} \
  ethvm/migrator:${version} "$@"
