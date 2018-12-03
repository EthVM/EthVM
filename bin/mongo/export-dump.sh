#!/usr/bin/env bash

set -o errexit
# set -o nounset
# set -o xtrace
# set -o verbose

# Give script sane defaults
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

DB="${DB:-ethvm_local}"
DATASET="${DATASET:-mainnet_sample.mongo.archive}"

echo "Exporting mongodb dump..."
docker-compose exec mongodb sh -c "mongodump --db='${DB}' --archive='/${DATASET}'"
