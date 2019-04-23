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
  local kafka_connect_dir=$(cd ${processing_dir}/connectors; pwd)
  local connectors=('sinks/jdbc' 'sources/eth-tokens-list' 'sources/exchanges' 'sources/web3')

  echo "Building connectors..."
  (cd ${processing_dir}; ./gradlew shadowJar)

  echo "Copying connector jar to out/ dir..."
  for i in "${connectors[@]}"; do
    (cp ${kafka_connect_dir}/${i}/build/libs/*.jar ${ROOT_DIR}/out/kafka-connect/)
  done

  echo "Restarting kafka connect (if running)..."
  (cd ${ROOT_DIR}; docker-compose restart kafka-connect)
}

read_version() {
  local raw_version_path=$(jq -car '.projects[] | select(.id=="kafka-ethvm-utils") | .version' $PROJECTS_PATH)
  local version_path=$(eval "echo -e ${raw_version_path}")
  echo $(to_version "${version_path}")
}

reset() {
  docker-compose exec kafka-1 sh -c "kafka-consumer-groups --bootstrap-server kafka-1:9091 --execute --reset-offsets --group connect-enkryptio-mongo-sink --to-earliest --all-topics"
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
