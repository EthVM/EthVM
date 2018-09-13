#!/bin/bash -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/../..; pwd)

export SCHEMA=$(jq tostring ${ROOT_DIR}/apps/avro-schemas/block.schema.v1.asvc)
curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/raw-blocks-value/versions
curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/blocks-value/versions

export SCHEMA=$(jq tostring ${ROOT_DIR}/apps/avro-schemas/pendingtx.schema.v1.asvc)
curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/raw-pending-txs-value/versions
