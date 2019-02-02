#!/usr/bin/env bash

set -o errexit \
    -o nounset

if [ "${TRACE:-}" == "true" ]; then
  set -o verbose \
      -o xtrace
fi

export SCRIPT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
export ROOT_DIR="$(cd ${SCRIPT_DIR}/.. && pwd)"

export MONGO_DIR="${ROOT_DIR}/mongo"

ensure_mongo() {

  local TIMEOUT=${1:-30}
  local HOST=$(echo ${MONGO_URL} | awk -F[/:] '{print $4}')

  # Wait until mongo logs that it's ready (or timeout after 60s)
  COUNTER=0
  while !(nc -z ${HOST} 27017) && [[ ${COUNTER} -lt ${TIMEOUT} ]] ; do
      sleep 2
      let COUNTER+=2
      echo "Waiting for mongo to initialize... ($COUNTER seconds so far)"
  done

} >&2

ensure_replicaset() {

  ensure_mongo "$@"

  echo "Initialising replica set: ${MONGO_URL}"
  mongo ${MONGO_URL} --eval "rs.initiate()"
} >&2


ensure_collections() {

  ensure_mongo "$@"

  echo "Creating collections"
  mongo ${MONGO_URL} < ${MONGO_DIR}/collections.js
} >&2

ensure_indexes() {

  ensure_mongo "$@"

  echo "Creating indexes"
  mongo ${MONGO_URL} < ${MONGO_DIR}/indexes.js
} >&2

init() {
  ensure_replicaset
  ensure_collections
  ensure_indexes
} >&2

run() {

  local command="${1:-""}"
  shift

  case ${command} in
    ensure-mongo)         ensure_mongo "$@";;
    ensure-replicaset)    ensure_replicaset "$@";;
    ensure-collections)   ensure_collections "$@";;
    ensure-indexes)       ensure_indexes "$@";;
    init)                 init;;
  esac
}

run "$@"
