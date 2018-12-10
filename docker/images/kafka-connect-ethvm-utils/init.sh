#!/bin/sh

set -o nounset
set -o errexit
set -o verbose
set -o xtrace

# Update sink with env variables
cat /sinks/mongo.json | \
jq '.config["topics"]=env.TOPICS' | \
jq '.config["key.converter.schema.registry.url"]=env.KAFKA_REGISTRY_URL' | \
jq '.config["value.converter.schema.registry.url"]=env.KAFKA_REGISTRY_URL' | \
jq '.config["mongo.uri"]=env.MONGODB_URL' \
> /sinks/mongo.json

# Register sink in Kafka Connect
curl \
  --retry 100 \
  --retry-connrefused \
  --max-time 10 \
  -H "Content-Type: application/json" \
  -X POST \
  -d /sinks/mongo.json \
  $KAFKA_CONNECT_URL/connectors

# Register sources in Kafka Connect
curl \
  --retry 100 \
  --retry-connrefused \
  --max-time 10 \
  -H "Content-Type: application/json" \
  -X POST \
  -d /sources/eth-lists.json \
  $KAFKA_CONNECT_URL/connectors
