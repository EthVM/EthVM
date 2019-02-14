#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

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
  local processing_dir=$(cd ${ROOT_DIR}/apps/processing; pwd)
  local kafka_connect_dir=$(cd ${processing_dir}/kafka-connect; pwd)

  echo "Building connector..."
  (cd ${processing_dir}; ./gradlew kafka-connect:shadowJar)

  echo "Copying connector jar to out/ dir..."
  (cd ${kafka_connect_dir}/build/libs/; mkdir -p ${ROOT_DIR}/out/kafka-connect/; cp kafka-connect-*.jar ${ROOT_DIR}/out/kafka-connect/)

  echo "Restarting kafka connect (if running)..."
  (cd ${ROOT_DIR}; docker-compose restart kafka-connect)
}

read_version() {
  local raw_version_path=$(jq -car '.projects[] | select(.id=="kafka-ethvm-utils") | .version' $PROJECTS_PATH)
  local version_path=$(eval "echo -e ${raw_version_path}")
  echo $(to_version "${version_path}")
}

reset() {
  docker-compose exec kafka-1 sh -c "kafka-consumer-groups --bootstrap-server kafka-1:9091 --execute --reset-offsets --group connect-enkryptio-mongo-primary-sink --to-earliest --all-topics"
  docker-compose exec kafka-1 sh -c "kafka-consumer-groups --bootstrap-server kafka-1:9091 --execute --reset-offsets --group connect-enkryptio-mongo-aux-sink --to-earliest --all-topics"
  docker-compose exec kafka-1 sh -c "kafka-consumer-groups --bootstrap-server kafka-1:9091 --execute --reset-offsets --group connect-enkryptio-mongo-secondary-sink --to-earliest --all-topics"
}

run() {
  local command="${1:-false}"

  case "${command}" in
    build-connector)   build_connector             ;;
    reset)             reset                       ;;
    help|*)            kafka_connect_usage; exit 0 ;;
  esac
}
run "$@"
