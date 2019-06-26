#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# Define variables
DATASET="ethvm_dev.sql.gz"

BRANCH=$(git branch 2>/dev/null | grep '^*' | colrm 1 2 | tr / -)

# docker_usage - prints docker subcommand usage
docker_usage() {
  echo ""
  echo "Utility that wraps docker / docker-compose commands to spin up a EthVM development environment."
  echo ""
  echo "Usage:"
  echo "  docker-run [COMMAND] [ARGS...]"
  echo ""
  echo "Commands:"
  echo "  up           [simple|default]   Create and start docker containers."
  echo "  start                           Start stopped docker containers."
  echo "  stop                            Stop docker containers."
  echo "  down                            Stop and remove docker containers, networks, images, and volumes."
  echo "  rebuild                         Build or rebuild docker services."
  echo "  restart                         Restart docker services."
  echo "  logs                            View output from containers."
  echo "  help                            Print the help information and exit."
  echo ""
}

# invalid - prints invalid message
invalid() {
  >&2 echo "Invalid argument passed!"
  >&2 echo ""
}

# up - process which option is going to be run to bring up the dev environment
up() {
  local type="${1:-"default"}"
  case "$type" in
    default) down; up_default ;;
    simple)  down; up_simple  ;;
    *)       invalid          ;;
  esac
}

# up - spins up a clean dev environment (but it will not run eth client, neither kafka-streams in order to control the flow of data)
up_default() {
  echo -e "Building utility docker images...\n"
  ${SCRIPT_DIR}/docker-build.sh build ethvm-utils
  ${SCRIPT_DIR}/docker-build.sh build migrator

  echo -e "Building containers..."
  docker-compose build

  echo -e "Starting up containers: traefik, api, explorer, db-principal, db-metrics, zookeeper kafka-1 kafka-schema-registry kafka-connect pgweb redis\n"
  docker-compose up -d traefik api explorer db-principal db-metrics zookeeper kafka-1 kafka-schema-registry kafka-connect pgweb redis

  echo -e "Initialising kafka...\n"
  ${SCRIPT_DIR}/ethvm-utils.sh kafka init

  echo -e "Initialising principal db...\n"
  ${SCRIPT_DIR}/migrator.sh principal all migrate

  echo -e "Initialising metrics db...\n"
  ${SCRIPT_DIR}/migrator.sh metrics all migrate

  echo -e "Re-building avro models...\n"
  ${SCRIPT_DIR}/avro.sh build

  echo -e "Re-building kafka connect connector...\n"
  ${SCRIPT_DIR}/kafka-connect.sh build-connector

  echo -e "Registering sinks and sources into kafka connect...\n"
  ${SCRIPT_DIR}/ethvm-utils.sh kafka-connect init

  echo -e "Ensuring parity mount point exists and has correct permissions...\n"
  mkdir -p ${PARITY_VOLUME_MOUNTPOINT}

  echo -e "Starting parity and kafka-manager...\n"
  docker-compose up -d parity kafka-manager
}

# up - spins up a dev environment with a fixed dataset ready to be used on frontend
up_simple() {

  echo -e "Building utility docker images...\n"
  ${SCRIPT_DIR}/docker-build.sh build ethvm-utils
  ${SCRIPT_DIR}/docker-build.sh build migrator

  echo "Starting up containers: traefik, db-principal, db-metrics, explorer, api, pgweb and redis \n"
  docker-compose build explorer api
  docker-compose up -d traefik db-principal db-metrics explorer api pgweb redis

  # Give time to breathe
  sleep 10

  echo -e "Checking current dataset...\n"
  mkdir -p ${ROOT_DIR}/datasets
  set +o errexit

  DATASETS=("principal-${BRANCH}.sql.gz" "metrics-${BRANCH}.sql.gz")

  for DATASET in "${DATASETS[@]}"; do

    [[ -f ${ROOT_DIR}/datasets/${DATASET} ]] && (curl -o ${ROOT_DIR}/datasets/${DATASET}.md5 https://ethvm.s3.amazonaws.com/datasets/${DATASET}.md5 --silent 2>/dev/null && cd ${ROOT_DIR}/datasets/ && md5sum --check ${DATASET}.md5 &>/dev/null)
    [[ $? -ne 0 ]] && (echo "Downloading dataset... \n" && curl -o ${ROOT_DIR}/datasets/${DATASET} https://ethvm.s3.amazonaws.com/datasets/${DATASET} --progress-bar) || echo -e "You're using latest dataset version! \n"
    set -o errexit

  done

  echo -e "Importing principal dataset \n"
  gunzip < ${ROOT_DIR}/datasets/${DATASETS[0]} | docker-compose exec -T db-principal psql --quiet --username "${PRINCIPAL_USER}" "${PRINCIPAL_DB}"

  echo -e "Importing metrics dataset \n"

  docker-compose exec -T db-metrics psql --username "${METRICS_USER}" "${METRICS_DB}" --quiet -c "ALTER DATABASE "${METRICS_DB}" SET timescaledb.restoring='on';"
  gunzip < ${ROOT_DIR}/datasets/${DATASETS[1]} | docker-compose exec -T db-metrics psql --quiet --username "${METRICS_USER}" "${METRICS_DB}"
  docker-compose exec -T db-metrics psql --username "${METRICS_USER}" "${METRICS_DB}" --quiet -c "ALTER DATABASE "${METRICS_DB}" SET timescaledb.restoring='off';"

}

# down - stops all running docker containers, volumes, images and related stuff
down() {
  docker-compose down -v --remove-orphans
}

# logs - outputs logs for containers
logs() {
  docker-compose logs -f -t "$1"
}

run() {
  local command="${1}"
  local action="${2}"
  shift 2

  case "${command}" in
    up)      up "${action}"       ;;
    down)    down                 ;;
    logs)    logs "$action"       ;;
    help|*)  docker_usage; exit 0 ;;
  esac
}
run "$@"
