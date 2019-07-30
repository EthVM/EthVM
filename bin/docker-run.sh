#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# Define variables
DATASET="ethvm_dev.sql.gz"

BRANCH=$(git branch 2>/dev/null | grep '^*' | colrm 1 2 | tr / -)

EXTRA_DOCKER_COMPOSE_FILES=$(jq -r '.docker.compose[]' $META_PATH)

# docker_usage - prints docker subcommand usage
docker_usage() {

  echo -e ""
  echo -e "Utility that wraps docker / docker-compose commands to spin up a EthVM development environment."
  echo -e ""
  echo -e "Usage:"
  echo -e "  docker-run [COMMAND] [ARGS...]"
  echo -e ""
  echo -e "Commands:"
  echo -e "  up    -m | --mode [MODE]          Create and start docker containers in the specified mode (if no mode is provided, default is dev)."
  echo -e "  down                              Stop and remove docker containers, networks, images, and volumes."
  echo -e "  logs                              View output from containers."
  echo -e "  help                              Print the help information and exit."
  echo -e ""

}

# invalid_argument - displays an invalid argument error message!
invalid_argument() {

  invalid "Invalid argument passed!"

}

# up - process which option is going to be run to bring up the dev environment
up() {

  local type="${1:-"-m default"}"
  shift # past argument

  if [[ $# == 0 ]]; then
    # By default, the default mode if no arg is specified is dev
    up_dev_mode_message
    down
    up_dev
  else
    # We process and parse arguments
    while [[ $# -gt 0 ]]; do
      local key="$1"

      case $key in
      -m | --mode)
        local value="$2"
        shift

        case "$value" in
        dev)
          up_dev_mode_message
          down
          up_dev
          break
          ;;

        simple)
          up_simple_mode_message
          down
          up_simple
          break
          ;;

        *)
          invalid_argument
          docker_usage
          break
          ;;
        esac

        ;;
      esac

      shift
    done
  fi
}

# up_dev_mode_message - describes which mode the user has selected
up_dev_mode_message() {

  local bold=$(tput bold)
  local reset=$(tput sgr0)

  section "DEV mode selected"
  echo "${bold}Description:${reset} This mode spins up a clean local DEV environment that allows to work with Kafka Streams"

}

# up_dev - spins up a clean dev environment (but it will not run eth client, neither kafka-streams in order to control the flow of data)
up_dev() {

  section "Building utility docker images..."
  ${SCRIPT_DIR}/docker-build.sh build ethvm-utils
  ${SCRIPT_DIR}/docker-build.sh build migrator

  section "Building docker containers..."
  docker-compose build

  section "Starting up following docker containers: \n\t - traefik \n\t - api \n\t - explorer \n\t - db-principal \n\t - db-metrics \n\t - zookeeper \n\t - kafka-1 \n\t - kafka-schema-registry \n\t - kafka-connect \n\t - pgweb \n\t - redis"
  docker-compose up -d traefik api explorer db-principal db-metrics zookeeper kafka-1 kafka-schema-registry kafka-connect pgweb redis

  section "Initialising kafka..."
  ${SCRIPT_DIR}/ethvm-utils.sh kafka init

  section "Initialising principal db..."
  INDEXES_AND_TRIGGERS=${PARITY_INSTA_MINING} ${SCRIPT_DIR}/migrator.sh principal migrate

  section "Initialising metrics db..."
  INDEXES_AND_TRIGGERS=${PARITY_INSTA_MINING} ${SCRIPT_DIR}/migrator.sh metrics migrate

  section "Building avro models..."
  ${SCRIPT_DIR}/avro.sh build

  section "Building kafka connect connector..."
  ${SCRIPT_DIR}/kafka-connect.sh build-connector

  section "Registering sinks and sources into kafka connect..."
  ${SCRIPT_DIR}/ethvm-utils.sh kafka-connect init

  section "Ensuring parity docker mount point exists..."
  mkdir -p ${PARITY_BIND_MOUNTPOINT}

  section "Starting following docker containers: \n\t - parity \n\t - kafka-manager"
  docker-compose up -d parity kafka-manager

  if [[ $compose_files != "-f ${ROOT_DIR}/docker-compose.yaml" ]]; then
    section "Starting up extra docker containers..."
    local images=""
    for container in $(jq -cr '.docker.containers[]' $META_PATH); do
      local key=$(echo "$container" | jq -cr '.id')
      local value=$(echo "$container" | jq -car '.value | join(" ")')
      [[ $container == *$key* ]] && images+="$value"
    done
    images=$($images | sed 's/\"//g')
    docker-compose ${compose_files} up -d ${images}
  fi

}

# up_simple_mode_message - describes which mode the user has selected
up_simple_mode_message() {

  local bold=$(tput bold)
  local reset=$(tput sgr0)

  section "SIMPLE mode selected"
  echo -e "${bold}Description:${reset} This mode spins a basic environment useful to work on Explorer or API with a fixed processed dataset (processing of new blocks is disabled)"

}

# up - spins up a dev environment with a fixed dataset ready to be used on frontend
up_simple() {

  section "Building utility docker images..."
  ${SCRIPT_DIR}/docker-build.sh build ethvm-utils
  ${SCRIPT_DIR}/docker-build.sh build migrator

  section "Starting up containers: \n\t - traefik \n\t - db-principal \n\t - db-metrics \n\t - explorer \n\t - api \n\t - pgweb \n\t - redis"
  docker-compose build explorer api
  docker-compose up -d traefik db-principal db-metrics explorer api pgweb redis

  # Give time to breathe
  sleep 10

  section "Checking current dataset..."
  mkdir -p ${ROOT_DIR}/datasets

  set +o errexit

  DATASETS=("principal-${BRANCH}.sql.gz" "metrics-${BRANCH}.sql.gz")

  for DATASET in "${DATASETS[@]}"; do

    [[ -f ${ROOT_DIR}/datasets/${DATASET} ]] && (curl -o ${ROOT_DIR}/datasets/${DATASET}.md5 https://ethvm.s3.amazonaws.com/datasets/${DATASET}.md5 --silent 2>/dev/null && cd ${ROOT_DIR}/datasets/ && md5sum --check ${DATASET}.md5 &>/dev/null)
    [[ $? -ne 0 ]] && (info "Downloading dataset..." && curl -o ${ROOT_DIR}/datasets/${DATASET} https://ethvm.s3.amazonaws.com/datasets/${DATASET} --progress-bar) || info "You're using latest dataset version! \n"

  done

  set -o errexit

  section "Importing principal dataset..."
  gunzip <${ROOT_DIR}/datasets/${DATASETS[0]} | docker-compose exec -T db-principal psql --quiet --username "${PRINCIPAL_USER}" "${PRINCIPAL_DB}"

  section "Importing metrics dataset..."
  docker-compose exec -T db-metrics psql --username "${METRICS_USER}" "${METRICS_DB}" --quiet -c "ALTER DATABASE "${METRICS_DB}" SET timescaledb.restoring='on';"
  gunzip <${ROOT_DIR}/datasets/${DATASETS[1]} | docker-compose exec -T db-metrics psql --quiet --username "${METRICS_USER}" "${METRICS_DB}"
  docker-compose exec -T db-metrics psql --username "${METRICS_USER}" "${METRICS_DB}" --quiet -c "ALTER DATABASE "${METRICS_DB}" SET timescaledb.restoring='off';"

}

# down - stops all running docker containers, volumes, images and related stuff
down() {

  section "Stopping running docker images (if applicable)..."

  docker-compose down -v --remove-orphans

}

# logs - outputs logs for containers
logs() {

  docker-compose logs -f -t "$1"

}

# run - main function
run() {

  local command="${1:-false}"
  [[ $command != false ]] && shift
  local extra_args="$@"

  case "${command}" in
  up)
    up $extra_args
    ;;

  down)
    down $extra_args
    ;;

  logs)
    logs $extra_args
    ;;

  help)
    docker_usage
    ;;

  *)
    invalid_argument
    docker_usage
    ;;
  esac

}

run "$@"
