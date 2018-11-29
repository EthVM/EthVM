#!/usr/bin/env bash

set -o nounset \
    -o errexit \
    -o verbose \
    -o xtrace

docker run \
  --rm \
  --network ethvm_back \
  -e KAFKA_BROKERS=1 \
  enkryptio/kafka-ethvm-init:0.1.0
