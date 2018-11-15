#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../../; pwd)
KAFKA_CONNECT_DIR=$(cd ${ROOT_DIR}/apps/kafka-connect; pwd)

# build the connector

echo "Building connector"

cd ${KAFKA_CONNECT_DIR}
./gradlew build

cp ${KAFKA_CONNECT_DIR}/build/libs/enkryptio-mongo-* ${KAFKA_CONNECT_DIR}/libs/

# restart kafka-connect

echo "Restarting kafka connect"
${ROOT_DIR}/bin/restart.sh kafka-connect

# register sink

echo "Registering sink"
curl -s -H "Content-Type: application/json" -X POST -d @${SCRIPT_DIR}/sink.json http://kafka-connect.ethvm.lan/connectors

