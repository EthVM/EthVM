#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# Define variables
DATASET="ethereum_mainnet.130k.parity.mongo.archive"

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
  echo "  fetch                               Downloads a processed data-set."
  echo "  help                                Print the help information and exit."
  echo ""
}

read_version() {
  local raw_version_path=$(jq -car '.projects[] | select(.id=="ethvm-utils") | .version' $PROJECTS_PATH)
  local version_path=$(eval "echo -e ${raw_version_path}")
  echo $(to_version "${version_path}")
}

init() {
  local version=$(read_version)
  docker run --rm --network ethvm_back -e MONGO_URL=mongodb://mongodb:27017/ethvm_local ethvm/ethvm-utils:${version} mongo init
}

# create_dump - creates a MongoDB dump file
create_dump() {
  docker-compose exec mongodb sh -c "mongodump --db='ethvm_local' --archive='/dump.mongo.archive'"
  mkdir -p ${ROOT_DIR}/datasets/dumps
  local date=$(date '+%Y-%m-%d-%H:%M')
  docker cp $(docker ps -aqf "name=mongodb"):/dump.mongo.archive ${ROOT_DIR}/datasets/dumps/dump-${date}.mongo.archive
}

# bootstrap - inserts into MongoDB a dump file
bootstrap() {
  docker-compose exec mongodb sh -c "mongorestore --archive=\"/datasets/${DATASET}\" --batchSize=100"
}

# fetch - grabs a concrete dataset from S3 storage
fetch() {
  echo "Checking current dataset..."
  mkdir -p ${ROOT_DIR}/datasets
  set +o errexit
  [[ -f ${ROOT_DIR}/datasets/${DATASET} ]] && (curl -o ${ROOT_DIR}/datasets/${DATASET}.md5 https://ethvm.s3.amazonaws.com/datasets/${DATASET}.md5 --silent 2>/dev/null && cd ${ROOT_DIR}/datasets/ && md5sum --check ${ROOT_DIR}/datasets/${DATASET}.md5 &>/dev/null)
  [[ $? -ne 0 ]] && (echo "Downloading dataset..." && curl -o ${ROOT_DIR}/datasets/${DATASET} https://ethvm.s3.amazonaws.com/datasets/${DATASET} --progress-bar) || echo "You're using latest dataset version!"
  set -o errexit
}

run() {
  local command="${1:-false}"
  local action="${2:-false}"

  case "${command}" in
    init)        init                 ;;
    create-dump) create_dump          ;;
    bootstrap)   bootstrap            ;;
    fetch)       fetch                ;;
    help|*)      kafka_usage; exit 0  ;;
  esac
}
run "$@"
