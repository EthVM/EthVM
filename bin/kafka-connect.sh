#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/utils.sh

# verify we have required utilities installed
ensure

# kafka_connect_usage - prints kafka connect subcommand usage
kafka_connect_usage() {
  echo ""
  echo "Utility to manipulate Kafka Connect."
  echo ""
  echo "Usage:"
  echo "  ethvm kafka [COMMAND]"
  echo ""
  echo "Commands:"
  echo "  create-topics                       Create EthVM Kafka topics."
  echo "  list-topics                         List registered Kafka topics."
  echo "  reset-topics                        Resets Kafka topics."
  echo "  help                                Print the help information and exit."
  echo ""
}

# build_connector - builds the Kafka connector
build_connector() {
  echo "Building connector..."

  local kafka_connect_dir=$(cd ${ROOT_DIR}/apps/kafka-connect; pwd)
  cd ${kafka_connect_dir}

  ./gradlew build
  cp ${kafka_connect_dir}/build/libs/enkryptio-mongo-* ${kafka_connect_dir}/libs/

  echo "Restarting kafka connect (if running)..."
  (cd ${ROOT_DIR}; docker-compose restart kafka-connect)
}

# register_sinks  - lists registered Kafka topics
register_sinks () {
  echo "Registering sinks..."
  local domain=$(prop "${ROOT_DIR}/.env" "DOMAIN")
  curl -s -H "Content-Type: application/json" -X POST -d @${SCRIPT_DIR}/kafka-connect/sinks/mongo.json http://kafka-connect.ethvm.${domain}/connectors
}

register_sources() {
  echo "Registering sources..."
  local domain=$(prop "${ROOT_DIR}/.env" "DOMAIN")
  curl -s -H "Content-Type: application/json" -X POST -d @${SCRIPT_DIR}/kafka-connect/sources/ethlists.json http://kafka-connect.ethvm.${domain}/connectors
}

reset() {
  docker-compose exec kafka-1 sh -c "kafka-consumer-groups --bootstrap-server kafka-1:9091 --execute --reset-offsets --group connect-enkryptio-mongo-sink --to-earliest --all-topics"
}

run() {
  local command="${1:-false}"

  case "${command}" in
    build-connector)   build_connector             ;;
    register-sinks)    register_sinks              ;;
    register-sources)  register_sources            ;;
    reset)             reset                       ;;
    help|*)            kafka_connect_usage; exit 0 ;;
  esac
}
run "$@"
