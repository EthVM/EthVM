#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

NETWORK=${NETWORK:-"ethvm_net"}

version=$(read_version ethvm-utils)

# source docker compose env variables
source ${ROOT_DIR}/.env

docker run --rm \
  --network ${NETWORK} \
  -e KAFKA_ZOOKEEPER_CONNECT=${KAFKA_ZOOKEEPER_CONNECT} \
  -e KAFKA_BOOTSTRAP_SERVERS=${KAFKA_BOOTSTRAP_SERVERS} \
  -e KAFKA_SCHEMA_REGISTRY_URL=${KAFKA_SCHEMA_REGISTRY_URL} \
  -e KAFKA_CONNECT_URL=${KAFKA_CONNECT_URL} \
  -e PRINCIPAL_JDBC_URL=${PRINCIPAL_JDBC_URL} \
  -e PRINCIPAL_USER=${PRINCIPAL_USER} \
  -e PRINCIPAL_PASSWORD=${PRINCIPAL_PASSWORD} \
  -e METRICS_JDBC_URL=${METRICS_JDBC_URL} \
  -e METRICS_USER=${METRICS_USER} \
  -e METRICS_PASSWORD=${METRICS_PASSWORD} \
  ethvm/ethvm-utils:${version} "$@"
