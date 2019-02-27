#!/usr/bin/env bash

set -o errexit \
    -o nounset

if [ "${TRACE:-}" == "true" ]; then
  set -o verbose \
      -o xtrace
fi

export SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
export ROOT_DIR="$(cd ${SCRIPT_DIR}/.. && pwd)"

export KAFKA_DIR="${ROOT_DIR}/kafka"
export CLASSPATH="${ROOT_DIR}/classpath/*"

ensure_zookeeper() {
  local TIMEOUT_MS=${1:-60000}
  java -cp "${CLASSPATH}" \
    io.confluent.admin.utils.cli.ZookeeperReadyCommand ${KAFKA_ZOOKEEPER_CONNECT} ${TIMEOUT_MS}
} >&2


ensure_kafka() {

  local MIN_EXPECTED_BROKERS=${1:-1}
  local TIMEOUT_MS=${2:-60000}

  ensure_zookeeper ${TIMEOUT_MS}

  java -cp "${CLASSPATH}" \
    io.confluent.admin.utils.cli.KafkaReadyCommand \
    --bootstrap-servers ${KAFKA_BOOTSTRAP_SERVERS} \
    ${MIN_EXPECTED_BROKERS} ${TIMEOUT_MS}
} >&2


ensure_topics() {

  # change pwd
  cd ${ROOT_DIR}

  local CREATE_IF_NOT_EXISTS=${1:-true}
  local TIMEOUT_MS=${2:-60000}

  ensure_kafka 1 ${TIMEOUT_MS}

  java -cp "${CLASSPATH}" \
      io.confluent.admin.utils.cli.TopicEnsureCommand \
      --config ${KAFKA_DIR}/client.properties \
      --file ${KAFKA_DIR}/topics.yml \
      --create-if-not-exists ${CREATE_IF_NOT_EXISTS} \
      --timeout ${TIMEOUT_MS}

} >&2

init() {

  ensure_topics true

} >&2

run() {

  local command="${1:-""}"
  shift

  case ${command} in
    ensure-zookeeper) ensure_zookeeper "$@";;
    ensure-kafka)     ensure_kafka "$@";;
    ensure-topics)    ensure_topics "$@";;
    init)             init "$@";;
  esac
}

run "$@"
