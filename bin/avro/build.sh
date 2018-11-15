#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../../; pwd)
AVRO_DIR=$(cd ${ROOT_DIR}/apps/avro; pwd)

echo "Generating avro schemas"
cd ${AVRO_DIR}
./gradlew :generateSchema
./gradlew :publishToMavenLocal
