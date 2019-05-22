#!/usr/bin/env bash

echo "Dockerizing templates..."
dockerize \
  -template /opt/ethvm/kafka:/opt/ethvm/kafka \
  -template /opt/ethvm/kafka-connect/sinks:/opt/ethvm/kafka-connect/sinks \
  -template /opt/ethvm/kafka-connect/sources:/opt/ethvm/kafka-connect/sources

echo "/ethvm-utils.sh - params: $@"
ethvm-utils.sh "$@"
