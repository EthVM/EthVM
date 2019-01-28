#!/usr/bin/env bash

# set -o errexit
# set -o nounset
# set -o verbose
# set -o xtrace

ensure_zookeeper() {
  echo "===> Checking if Zookeeper nodes are ready ..."
  cub zk-ready $ZOOKEEPER_URL $KAFKA_CUB_TIMEOUT
}

ensure_kafka() {
  echo "===> Checking if Kafka brokers are ready ..."
  cub kafka-ready $KAFKA_BROKERS $KAFKA_CUB_TIMEOUT --zookeeper_connect $ZOOKEEPER_URL
}

ensure_kafka_connect() {
  echo "===> Checking if Kafka Connect is ready ..."
  # Whenever we can upgrade properly version --> curl --retry 100 --retry-connrefused --max-time 10 $KAFKA_CONNECT_URL

  while true
  do
    STATUS=$(curl -s -o /dev/null -w '%{http_code}' $KAFKA_CONNECT_URL)
    if [ $STATUS -eq 200 ]; then
      break
    fi
    sleep 2
  done
}

create_topics() {
  echo "===> Create Kafka topics (if necessary) ..."
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 1  --topic processing-metadata --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 1  --topic blocks --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic transactions --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic uncles --config retention.ms=-1 --config cleanup.policy=compact

  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic block-metrics-by-block --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic block-metrics-by-day --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic aggregate-block-metrics-by-day --config retention.ms=-1 --config cleanup.policy=compact

  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 1  --topic contract-metadata --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic contract-destructions --config retention.ms=-1 --config cleanup.policy=compact
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic contract-creations --config retention.ms=-1 --config cleanup.policy=compact

  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic token-transfers --config retention.ms=-1
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic fungible-token-movements --config retention.ms=-1
  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic balances --config retention.ms=-1 --config cleanup.policy=compact

  kafka-topics --create --if-not-exists --zookeeper $ZOOKEEPER_URL --replication-factor $KAFKA_REPLICATION_FACTOR --partitions 12 --topic pending-transactions --config retention.ms=-1 --config cleanup.policy=compact
}

reset_topics() {
  echo "===> Reset Kafka topics (if necessary) ..."
  kafka-streams-application-reset --zookeeper $ZOOKEEPER_URL --bootstrap-servers $KAFKA_BOOTSTRAP_URL --application-id block-processor --input-topics blocks
  kafka-streams-application-reset --zookeeper $ZOOKEEPER_URL --bootstrap-servers $KAFKA_BOOTSTRAP_URL --application-id state-processor --input-topics account-state
}

curl_register() {
  curl -s -H "Content-Type: application/json" -X POST -d @${1} ${KAFKA_CONNECT_URL}/connectors
}

register_eth_list_source() {
  echo "===> Registering ETH lists source ..."
  curl_register /data/sources/eth-lists-source.json
}

register_mongo_sink() {
  echo "===> Registering MongoDB sink ..."
  curl_register /data/sinks/mongo-block-sink.json
  curl_register /data/sinks/mongo-ancillary-sink.json
}

run() {
  local command="${1:-""}"

  case ${command} in
    create-topics)    ensure_zookeeper; ensure_kafka; create_topics    ;;
    reset-topics)     ensure_zookeeper; ensure_kafka; reset_topics     ;;
    register-sources) ensure_kafka_connect; register_eth_list_source   ;;
    register-sinks)   ensure_kafka_connect; register_mongo_sink        ;;
  esac
}
run "$@"
