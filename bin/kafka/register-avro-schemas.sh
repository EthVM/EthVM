#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../..; pwd)

# Uncomment if we need to register avro schemas as keys

#for filename in ${ROOT_DIR}/apps/avro-schemas/keys/*.avsc; do
#
#    SCHEMA=$(jq tostring ${filename})
#    SCHEMA_NAME=$(basename ${filename} | sed -e 's/.avsc//' | sed -e 's/.*_//')
#
#    echo "Registering ${SCHEMA_NAME}"
#    curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -d "{\"schema\":${SCHEMA}}" http://kafka-schema-registry.ethvm.lan/subjects/${SCHEMA_NAME}-key/versions
#    echo ""
#
#done

for filename in ${ROOT_DIR}/apps/avro-schemas/values/*.avsc; do

    SCHEMA=$(jq tostring ${filename})
    SCHEMA_NAME=$(basename ${filename} | sed -e 's/.avsc//' | sed -e 's/.*_//')

    echo "Registering ${SCHEMA_NAME}"
    curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -d "{\"schema\":${SCHEMA}}" http://kafka-schema-registry.ethvm.lan/subjects/${SCHEMA_NAME}-value/versions
    echo ""

done
