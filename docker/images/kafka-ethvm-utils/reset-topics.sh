#!/usr/bin/env bash

set -o errexit
# set -o nounset
# set -o xtrace
# set -o verbose

# Give script sane defaults
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# import utils
source ${ROOT_DIR}/utils.sh

# verify we have required utilities installed
ensure

run() {
  echo "===> Reset Kafka topics (if necessary) ..."
  kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id blocks-processor --input-topics blocks
  kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id canonical-chain-processor --input-topics processed-blocks
  kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id charts-processor --input-topics blocks
  kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id account-state-processor --input-topics account-state
  kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka:9092 --application-id pending-transactions-processor --input-topics pending-transactions
}
run "$@"
