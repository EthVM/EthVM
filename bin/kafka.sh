#!/usr/bin/env bash

set -o errexit
set -o nounset
# set -o xtrace
# set -o verbose

# Give script sane defaults
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# import utils
source ${SCRIPT_DIR}/utils.sh

# verify we have required utilities installed
ensure

# kafka_usage - prints monkey subcommand usage
kafka_usage() {
  echo ""
  echo "Utility to manipulate Kafka."
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

# create_topics - create EthVM Kafka topics
create_topics() {
  docker run --rm --network ethvm_back -e KAFKA_BROKERS=1 enkryptio/kafka-ethvm-init:0.1.0
}

# list_topics - lists registered Kafka topics
list_topics() {
  docker-compose exec kafka sh -c "kafka-topics --list --zookeeper zookeeper:2181"
}

# TODO: reset_topics - reset registered Kafka topics (if any)
# reset_topics() {}

run() {
  local command="${1:-false}"
  local action="${2:-false}"

  case "${command}" in
    create-topics) up "${action}"       ;;
    list-topics)   down                 ;;
    help|*)        kafka_usage; exit 0  ;;
  esac
}
run "$@"
