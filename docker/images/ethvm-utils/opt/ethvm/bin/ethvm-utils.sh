#!/usr/bin/env bash

set -o errexit
set -o nounset

if [ "${TRACE:-}" == "true" ]; then
  set -o verbose
  set -o xtrace
fi

export SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
export ROOT_DIR="$(cd ${SCRIPT_DIR}/.. && pwd)"

init() {

  ${SCRIPT_DIR}/kafka-utils.sh init
  ${SCRIPT_DIR}/kafka-connect-utils.sh init

} >&2

run() {

  local command="${1:-""}"
  shift

  case ${command} in
    kafka)            ${SCRIPT_DIR}/kafka-utils.sh "$@";;
    kafka-connect)    ${SCRIPT_DIR}/kafka-connect-utils.sh "$@";;
    init)             init "$@";;
  esac

}

run "$@"
