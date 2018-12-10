#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/utils.sh

# verify we have required utilities installed
ensure

# kafka_usage - prints kafka subcommand usage
kafka_usage() {
  echo ""
  echo "Utility to manipulate MongoDB."
  echo ""
  echo "Usage:"
  echo "  ethvm mongo [COMMAND]"
  echo ""
  echo "Commands:"
  echo "  init                                Initializes MongoDB with required components for EthVM."
  echo "  bootstrap                           Inserts into MongoDB a dump file with a dataset."
  echo "  create-dump                         Creates a MongoDB dump file."
  echo "  help                                Print the help information and exit."
  echo ""
}

# init - lists registered Kafka topics
init() {
  docker-compose exec -T mongodb mongo --eval "rs.initiate()"
  sleep 5
  local raw_version_path=$(jq -car '.projects[] | select(.id=="mongodb-ethvm-utils") | .version' $PROJECTS_PATH)
  local version_path=$(eval "echo -e ${raw_version_path}")
  local version=$(to_version "${version_path}")
  docker run --rm --network ethvm_back -e MONGODB_URL='mongodb://mongodb:27017/ethvm_local' enkryptio/mongodb-ethvm-utils:${version}
}

# create_dump - creates a MongoDB dump file
create_dump() {
  docker-compose exec mongodb sh -c "mongodump --db='ethvm_local' --archive='/dump.mongo.archive'"
  mkdir -p ${ROOT_DIR}/datasets/dumps
  local date=$(date '+%Y-%m-%d-%H:%M:%S')
  docker cp $(docker ps -aqf "name=mongodb"):/dump.mongo.archive ${ROOT_DIR}/datasets/dumps/dump-${date}.mongo.archive
}

# bootstrap - inserts into MongoDB a dump file
bootstrap() {
  docker-compose exec mongodb sh -c "mongorestore --archive=\"/datasets/mainnet_sample.mongo.archive\""
}

run() {
  local command="${1:-false}"
  local action="${2:-false}"

  case "${command}" in
    init)        init                 ;;
    create-dump) create_dump          ;;
    bootstrap)   bootstrap            ;;
    help|*)      kafka_usage; exit 0  ;;
  esac
}
run "$@"
