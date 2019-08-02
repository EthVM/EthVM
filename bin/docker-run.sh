#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# Define variables
DATASET="ethvm_dev.sql.gz"

# docker_usage - prints docker subcommand usage
docker_usage() {

cat << EOF

NAME:
  docker-run - Utility that wraps docker / docker-compose commands to spin up an EthVM development environment

USAGE:
  docker-run command [arguments...]

COMMANDS:
    up [mode] Create and start docker containers in the specified mode (default: dev-private)
    down      Stop and remove docker containers, networks, images, and volumes
    logs      View output from containers
    help      Prints the help information

ARGS:
    <mode>    Possible options: simple, dev-mainnet, dev-ropsten, dev-private (default: dev-private)

EOF

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
  source ${ROOT_DIR}/.env

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
