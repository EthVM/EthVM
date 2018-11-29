#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../../; pwd)
KAFKA_CONNECT_DIR=$(cd ${ROOT_DIR}/apps/kafka-connect; pwd)

# register sink

echo "Registering sources"
curl -s -H "Content-Type: application/json" -X POST -d @${SCRIPT_DIR}/sources/ethlists.json http://kafka-connect.ethvm.lan/connectors

