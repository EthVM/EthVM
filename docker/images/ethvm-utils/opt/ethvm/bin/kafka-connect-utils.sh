#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ "${TRACE:-}" == "true" ]; then
  set -o verbose
  set -o xtrace
fi

export SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
export ROOT_DIR="$(cd ${SCRIPT_DIR}/.. && pwd)"

export KAFKA_CONNECT_DIR="${ROOT_DIR}/kafka-connect"

ensure_kafka_connect() {

  local TIMEOUT=${1:-60}
  local HOST=$(echo ${KAFKA_CONNECT_URL} | awk -F[/:] '{print $4}')

  # TODO extract port

  echo "Ensuring kafka-connect ${KAFKA_CONNECT_URL}"

  # Wait until mongo logs that it's ready (or timeout after 60s)
  COUNTER=0
  while !(nc -z ${HOST} 8083) && [[ ${COUNTER} -lt ${TIMEOUT} ]] ; do
      sleep 2
      let COUNTER+=2
      echo "Waiting for kafka connect to initialize... ($COUNTER seconds so far)"
  done

} >&2

curl_register() {

  local FILE=${1}
  curl -s -H "Content-Type: application/json" -X POST -d @${FILE} ${KAFKA_CONNECT_URL}/connectors

} >&2

register_sources() {
  echo "===> Registering sources ..."
  ensure_kafka_connect

  local SOURCES=$(ls ${KAFKA_CONNECT_DIR}/sources/*.json)

  for FILE in ${SOURCES}; do
    curl_register ${FILE}
  done

} >&2

register_sinks() {
  echo "===> Registering sinks ..."
  ensure_kafka_connect

  local SINKS=$(ls ${KAFKA_CONNECT_DIR}/sinks/*.json)

  for FILE in ${SINKS}; do
    curl_register ${FILE}
  done

} >&2

register() {
  echo "===> Registering ${1} ..."
  ensure_kafka_connect
  curl_register ${KAFKA_CONNECT_DIR}/${1}
} >&2

init() {

  register_sinks
  register_sources

} >&2

run() {

  local command="${1:-""}"
  shift

  case ${command} in
    ensure-kafka-connect) ensure_kafka_connect "$@";;
    ensure-sinks)         register_sinks "$@"      ;;
    ensure-sources)       register_sources "$@"    ;;
    register)             register "$@"            ;;
    init)                 init "$@"                ;;
  esac
} >&2

run "$@"
