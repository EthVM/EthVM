#!/bin/bash -e

ensure_zookeeper() {
  echo "===> Check if Zookeeper is ready ..."
  if ! [ "$(cub zk-ready $ZOOKEEPER ${KAFKA_CUB_TIMEOUT:-300})" ]; then
    echo "===> Zookeeper seems to be down ..."
    exit 1
  fi
}

ensure_kafka() {
  echo "===> Check if Zookeeper is ready ..."
  if ! [ "$(cub kafka-ready $KAFKA_BROKERS ${KAFKA_CUB_TIMEOUT:-300} --zookeeper_connect $ZOOKEEPER)" ]; then
    echo "===> Kafka seems to be down ..."
    exit 1
  fi
}

create() {
  echo "===> Create Kafka topics ..."
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 12 --topic blocks --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 12 --topic account-state --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 12 --topic pending-transactions --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 1 --topic metadata --config retention.ms=-1 --config cleanup.policy=compact
}

main() {
  ensure_zookeeper
  ensure_kafka
  create
}
main
