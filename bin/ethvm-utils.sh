#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

version=$(read_version ethvm-utils)

docker run --rm \
  --network ethvm_back \
  -e KAFKA_ZOOKEEPER_CONNECT=${KAFKA_ZOOKEEPER_CONNECT} \
  -e KAFKA_BOOTSTRAP_SERVERS=${KAFKA_BOOTSTRAP_SERVERS} \
  -e KAFKA_SCHEMA_REGISTRY_URL=${KAFKA_SCHEMA_REGISTRY_URL} \
  -e KAFKA_CONNECT_URL=${KAFKA_CONNECT_URL} \
  -e MONGO_URL=${MONGO_URL} \
  ethvm/ethvm-utils:${version} "$@"
