#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

kafka_streams() {

  cd ${APPS_PATH}/processing
  ./gradlew :kafka-streams:run $@

} >&2

run() {

  local command="${1:-""}"
  shift

  case ${command} in
    kafka-streams) kafka_streams "$@" ;;
  esac

} >&2

run "$@"


