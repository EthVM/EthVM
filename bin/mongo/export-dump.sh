#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

DATASET="ethvm_mainnet_sample.mongo.archive"

echo "Exporting mongodb dump..."
CMD="mongodump --db='ethvm_local' --archive='/${DATASET}'"
echo "Executing: ${CMD}"
docker-compose exec mongodb sh -c "$CMD"
