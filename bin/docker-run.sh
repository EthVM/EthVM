#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# Define variables
DATASET="ethvm_dev.sql.gz"

BRANCH=$(git branch 2>/dev/null | grep '^*' | colrm 1 2 | tr / -)

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

  local bold=$(tput bold)
  local reset=$(tput sgr0)

  # Assign default values
  local env="${1:-"dev_ropsten"}"

  section "Starting up environment: $env"

  # Check if env exists before proceeding
  local found=$(jq --arg env $env --raw-output '..| objects | .up//empty | has($env)' $DOCKER_RUN_META_PATH)
  [[ "$found" != "true" ]] && invalid "Invalid mode specified! Aborting execution..." && exit 1

  # Iterate over instructions
  jq --arg env $env -c '.up | objects | to_entries[] | select(.key == $env) | .value[] | tostring' $DOCKER_RUN_META_PATH \
    | xargs -L 1 bash -c

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
