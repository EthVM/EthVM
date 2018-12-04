#!/usr/bin/env bash

set -o errexit
# set -o nounset
# set -o verbose
# set -o xtrace

# default vars
ZOOKEEPER=${ZOOKEEPER:-"zookeeper:2181"}
KAFKA_CUB_TIMEOUT=${KAFKA_CUB_TIMEOUT:-300}

ensure_zookeeper() {
  echo "===> Check if Zookeeper is ready ..."
  cub zk-ready $ZOOKEEPER $KAFKA_CUB_TIMEOUT
}

ensure_kafka() {
  echo "===> Check if Kafka is ready ..."
  cub kafka-ready $KAFKA_BROKERS $KAFKA_CUB_TIMEOUT --zookeeper_connect $ZOOKEEPER
}

create() {
  echo "===> Create Kafka topics (if necessary) ..."
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 12 --topic blocks --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 12 --topic account-state --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 12 --topic pending-transactions --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 1 --topic metadata --config retention.ms=-1 --config cleanup.policy=compact
}

run() {
  ensure_zookeeper
  ensure_kafka
  create
}
run
