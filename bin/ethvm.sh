#!/usr/bin/env bash

set -o errexit
set -o nounset

# set -o xtrace
# set -o verbose

# Give script sane defaults
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# usage - prints the help for this command
usage() {
  echo ""
  echo "Little utility script that wraps docker-compose commands with others of our own"
  echo ""
  echo "Usage:"
  echo "  ethvm [COMMAND] [ARGS...]"
  echo "  ethvm -h|--help"
  echo ""
  echo "Commands:"
  echo "  up              [full|simple]  Create and start docker containers."
  echo "  down                           Stop and remove docker containers, networks, images, and volumes."
  echo "  rebuild                        Build or rebuild docker services."
  echo "  restart                        Restart docker services."
  echo ""
  exit 1
}

# ensure - checks that whe have needed utilities installed on our system
ensure() {
  if ! [ -x "$(command -v docker)" ]; then
    >&2 echo "docker is necessary to be installed to run this script!"
    exit 1
  fi

  if ! [ -x "$(command -v docker-compose)" ]; then
    >&2 echo "docker-compose is necessary to be installed to run this script!"
    exit 1
  fi
}

# up - spins up a clean dev environment (but it will not run eth client, neither bolt in order to control the flow of data)
up() {
  echo -e "Starting up containers...\n"
  docker-compose up -d --build

  echo -e "Waiting 15 seconds to allow previous docker services initialisation..."
  sleep 15

  echo -e "Creating kafka topics...\n"
  ${SCRIPT_DIR}/kafka/init.sh

  echo "Initialisation of mongo...\n"
  ${SCRIPT_DIR}/mongo/init.sh
}

# up_full - spins up a full automated environment where everything is going to run on docker
#           Keep in mind that this mode can hog your machine
up_full() {
  up

  echo "Starting up extra containers: ethereumj, bolt"
  ${DOCKER_COMPOSE} -f docker-compose.extra.yaml up -d --build
}

# up - spins up a dev environment with a fixed dataset ready to be used on frontend
up_simple() {
  echo "Starting up containers: traefik, mongo, redis ethvm and server"
  docker-compose up -d --build traefik mongodb redis ethvm server

  echo -e "\nWaiting 10 seconds to allow previous docker containers initialisation...\n"
  sleep 10

  echo "Initialisation of mongo"
  ${SCRIPT_DIR}/mongo/init.sh

  echo "Importing bootstraped db to mongo..."
  git lfs fetch --all
  docker-compose exec mongodb sh -c "mongorestore --archive=\"/datasets/*.mongo.archive\""
}

# down - stops all running docker containers, volumes, images and related stuff
down() {
  docker-compose down -v --remove-orphans
}

# rebuild - recreates running containers
rebuild() {
  docker-compose rebuild
}

# restart - restart docker services
restart() {
  docker-compose restart
}

# parse_args - parse positional args needed by some commands
# Credits: https://github.com/mattbryson/bash-arg-parse/blob/master/arg_parse_example
parse_args() {
  # positional args
  args=()

  # named args
  while [ "$1" != "" ]; do
    case "$1" in
      -h | --help ) usage ;;      # show usage
      * )           args+=("$1")  # if no match, add it to the positional args
    esac
    shift # move to next kv pair
  done

  # restore positional args
  set -- "${args[@]}"

  # set positionals to vars
  positional_1="${args[0]}"
  positional_2="${args[1]}"
}

# run - execute main script
run() {
  ensure
  parse_args "$@"
  case "$positional_1" in
    up)      down; up  ;;
    down)    down      ;;
    rebuild) rebuild   ;;
    restart) restart   ;;
    *) usage ;;
  esac
}
run "$@"
