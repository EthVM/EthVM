#!/bin/bash

export SCHEMA=$(jq tostring block.schema.v1.asvc)
curl -H "Content-Type: application/vnd.schemaregistry.v1+json" -X POST -d"{\"schema\":$SCHEMA}" http://kafka-schema-registry.ethvm.lan/subjects/raw-blocks-value/versions
