#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ "${TRACE:-}" == "true" ]; then
  set -o verbose
  set -o xtrace
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

delete_topics() {

  topics_to_preserve=${1:-''}

  # change pwd
  cd ${ROOT_DIR}

  local topics=$(cat ${KAFKA_DIR}/topics.yml | grep 'name:' | sed -e 's/.*name: \(.*\)/\1/g')

  for topic in ${topics}; do

    if [[ ${topics_to_preserve} == *"${topic}"* ]]; then
      echo "Preserving topic: ${topic}"
    else
      echo "Deleting topic: ${topic}"

      kafka-topics.sh \
        --delete \
        --zookeeper ${KAFKA_ZOOKEEPER_CONNECT} \
        --topic ${topic}

      echo "Topic deleted: ${topic}"

    fi

  done

} >&2

reset_processor_offsets() {

  # change pwd
  cd ${ROOT_DIR}

  local topics_file=${KAFKA_DIR}/processor-topics.json

  local processors=$(jq '. | keys[]' ${topics_file} | sed -e 's/\"//g')

  for processor in ${processors}; do
    local topics=$(jq ".[\"${processor}\"] | values[]" ${topics_file} | tr '\n' ','  | sed -e 's/\"//g' | sed -e 's/,$//')

    echo "Resetting offsets for processor: ${processor}"

    kafka-streams-application-reset.sh  \
      --zookeeper ${KAFKA_ZOOKEEPER_CONNECT} \
      --bootstrap-servers ${KAFKA_BOOTSTRAP_SERVERS} \
      --application-id ${processor} \
      --input-topics ${topics}

    echo "Processor offsets reset: ${processor}"

  done

} >&2

init() {

  ensure_topics true

} >&2

run() {

  local command="${1:-""}"
  shift

  case ${command} in
    init)                    init "$@";;
    ensure-zookeeper)        ensure_zookeeper "$@";;
    ensure-kafka)            ensure_kafka "$@";;
    ensure-topics)           ensure_topics "$@";;
    delete-topics)           delete_topics "$@";;
    reset-processor-offsets) reset_processor_offsets "$@";;
  esac

}

run "$@"
