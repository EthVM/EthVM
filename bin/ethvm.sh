#!/usr/bin/env bash

set -o errexit
# set -o nounset
# set -o xtrace
# set -o verbose

VERSION='0.1.0'

# Give script sane defaults
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# version - prints the current version of the script
version() {
  echo "EthVM CLI version ${VERSION}"
}

# usage - prints the help for this command
usage() {
  echo ""
  echo "EthVM CLI."
  echo ""
  echo "Find more information at: https://github.com/enKryptIO/ethvm/wiki/EthVM-CLI"
  echo ""
  echo "Usage:"
  echo "  ethvm [COMMAND] [ARGS...]"
  echo ""
  echo "Options:"
  echo "  ethvm --version | -v             Print version information and exit."
  echo "  ethvm --help    | -h             Print this help information and exit."
  echo ""
  echo "Commands:"
  echo "  docker | d                       Spin up an EthVM environment suitable for development purposes."
  echo "  docker-build | db                Build and upload different docker images used in this project."
  echo "  monkey | m                       Utility to generate random transactions to a RPC endpoint."
  echo ""
}

# parse_args - parse positional args needed by some commands
parse_args() {
  # positional args
  args=()

  # named args
  while [[ "$1" != "" ]]; do
    case "$1" in
      -v | --version ) version; exit 0 ;;
      -h | --help )    usage; exit 0   ;; # show usage
      * )              args+=("$1")       # if no match, add it to the positional args
    esac
    shift # move to next kv pair
  done

  # restore positional args
  set -- "${args[@]}"

  # set positionals to vars
  command="${args[0]}"
  action="${args[1]}"
  subaction="${args[2]}"
}

# run - execute main script
run() {
  parse_args "$@"
  case ${command} in
    docker|d)        ${SCRIPT_DIR}/docker.sh $action                  ;;
    docker-build|db) ${SCRIPT_DIR}/docker-build.sh $action $subaction ;;
    monkey|m)        ${SCRIPT_DIR}/monkey.sh $action                  ;;
    *)               usage; exit 0                                    ;;
  esac
}
run "$@"
