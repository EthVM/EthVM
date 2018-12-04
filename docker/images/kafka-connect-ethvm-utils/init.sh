#!/bin/sh

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

# Update sink with env variables
cat sink.json | \
jq '.config["connector.class"]=env.CONNECTOR' | \
jq '.config["topics"]=env.TOPICS' | \
jq '.config["key.converter.schema.registry.url"]=env.KAFKA_REGISTRY_URL' | \
jq '.config["value.converter.schema.registry.url"]=env.KAFKA_REGISTRY_URL' | \
jq '.config["mongo.uri"]=env.MONGODB_URL' \
> sink.json

# Register sink in Kafka Connect
curl \
  --retry 100 \
  --retry-connrefused \
  --max-time 10 \
  -H "Content-Type: application/json" \
  -X POST \
  -d sink.json \
  $KAFKA_CONNECT_URL/connectors
