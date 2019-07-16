#!/usr/bin/env bash

dockerize \
  -template /opt/ethvm/kafka:/opt/ethvm/kafka \
  -template /opt/ethvm/kafka-connect/sinks:/opt/ethvm/kafka-connect/sinks \
  -template /opt/ethvm/kafka-connect/sources:/opt/ethvm/kafka-connect/sources

ethvm-utils.sh "$@"
