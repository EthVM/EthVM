#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

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

  echo -e "Starting up containers: traefik, api, explorer, timescale, zookeeper kafka-1 kafka-schema-registry kafka-connect pgweb \n"
  docker-compose up -d traefik api explorer timescale zookeeper kafka-1 kafka-schema-registry kafka-connect pgweb

  echo -e "Initialising kafka...\n"
  ${SCRIPT_DIR}/ethvm-utils.sh kafka init

  echo -e "Initialising timescale..\n"
  ${SCRIPT_DIR}/migrator.sh migrate

  echo -e "Re-building avro models...\n"
  ${SCRIPT_DIR}/avro.sh build

  echo -e "Re-building kafka connect connector...\n"
  ${SCRIPT_DIR}/kafka-connect.sh build-connector

  echo "Registering sinks and sources into kafka connect..."
  ${SCRIPT_DIR}/ethvm-utils.sh kafka-connect init
}

# up - spins up a dev environment with a fixed dataset ready to be used on frontend
up_simple() {

  echo -e "Building utility docker images...\n"
  ${SCRIPT_DIR}/docker-build.sh build ethvm-utils migrator

  echo "Starting up containers: traefik, mongo, timescale, explorer, api and pgweb"
  docker-compose up -d --build traefik mongodb timescale explorer api pgweb

  # Give time to breathe
  sleep 10

  gunzip < ${ROOT_DIR}/datasets/ethvm_dev.sql.gz | docker-compose exec -T timescale psql --username "${POSTGRES_USER}" ethvm_dev
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

  case "${command}" in
    up)      up "${action}"       ;;
    down)    down                 ;;
    logs)    logs "$2"            ;;
    help|*)  docker_usage; exit 0 ;;
  esac
}
run "$@"
