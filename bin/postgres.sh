#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

run() {
  local command="${1}"
  local action="${2}"

  case "${command}" in
    dump) docker-compose exec -u postgres timescale pg_dump ethvm_dev | gzip > datasets/ethvm_dev.sql.gz ;;
  esac
}
run "$@"
