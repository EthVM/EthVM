#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# avro_usage - prints avro subcommand usage
avro_usage() {
  echo ""
  echo "Utility to manipulate Avro."
  echo ""
  echo "Usage:"
  echo "  ethvm avro [COMMAND]"
  echo ""
  echo "Commands:"
  echo "  build                               Builds and publishes to local repository the Avro schemas."
  echo "  help                                Print the help information and exit."
  echo ""
}

# create_topics - create EthVM Kafka topics
build_avro() {

  info "Generating avro schemas"
  local avro_dir=$(cd ${ROOT_DIR}/apps/processing; pwd)
  (cd ${avro_dir}; ./gradlew avro:generateAvroJava && ./gradlew avro:publishToMavenLocal)

}

# run - main function
run() {

  local command="${1:-false}"

  case "${command}" in
    build)  build_avro         ;;
    help|*) avro_usage; exit 0 ;;
  esac

}

run "$@"
