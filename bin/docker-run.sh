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
  local env="${1:-"dev-private"}"

  # Check if env exists before proceeding
  local meta=$(jq --arg env $env --raw-output --compact-output '..| objects | select(.id == $env)' $DOCKER_RUN_META_PATH)
  [[ ! -n "$meta" ]] && invalid "Invalid environment specified! Aborting execution..." && exit 1

  section "Starting up environment..."
  info "Selected env: $env"
  ${SCRIPT_DIR}/docker-templer.sh $env
  cp ${ROOT_DIR}/docker/templer/stacks/{.env,docker-compose.yaml} ${ROOT_DIR}/

  # Load the corresponding script and init the env
  local script=$(jq --raw-output '.script' <<< $meta)
  source ${SCRIPT_DIR}/docker-run-envs/$script

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
