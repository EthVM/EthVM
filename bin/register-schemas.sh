#!/bin/bash -e

export SCHEMA=$(jq tostring apps/avro-schemas/block.schema.v1.asvc)
curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/raw-blocks-value/versions

export SCHEMA=$(jq tostring apps/avro-schemas/pendingtx.schema.v1.asvc)
curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/raw-pending-txs-value/versions
