#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/env.sh

# verify we have required utilities installed
ensure

# kafka_usage - prints kafka subcommand usage
kafka_usage() {
  echo ""
  echo "Utility to manipulate Kafka."
  echo ""
  echo "Usage:"
  echo "  ethvm kafka [COMMAND]"
  echo ""
  echo "Commands:"
  echo "  create-topics                       Creates EthVM Kafka topics."
  echo "  list-topics                         List current registered Kafka topics."
  echo "  reset-topics                        Resets registered Kafka topics to have offset 0."
  echo "  help                                Print the help information and exit."
  echo ""
}

read_version() {
  local raw_version_path=$(jq -car '.projects[] | select(.id=="kafka-ethvm-utils") | .version' $PROJECTS_PATH)
  local version_path=$(eval "echo -e ${raw_version_path}")
  echo $(to_version "${version_path}")
}

# create_topics - create EthVM Kafka topics
create_topics() {
  local version=$(read_version)
  docker run --rm --network ethvm_back \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
    -e KAFKA_BOOTSTRAP_SERVERS=kafka-1:9091 \
    ethvm/ethvm-utils:${version} ensure-topics
}

# list_topics - lists registered Kafka topics
list_topics() {
  docker-compose exec kafka-1 sh -c "kafka-topics --list --zookeeper zookeeper:2181"
}

# TODO: reset_topics - reset registered Kafka topics (if any)
reset_streams() {

  declare -A topics=(\
    ['block-author-processor']='canonical_block_header' \
    ['block-metrics-processor']='canonical_block_header,canonical_transactions,canonical_transaction_fees,canonical_traces' \
    ['contract-lifecycle-processor']='canonical_traces,canonical_contract_lifecycle,contract_lifecycle_events' \
    ['contract-metadata-processor']='contract' \
    ['flat-map-processor']='canonical_uncles,canonical_transactions,canonical_receipts,canonical_traces' \
    ['fungible-balance-processor']='fungible_balance_delta,fungible_balance,canonical_block_header,canonical_traces,canonical_traces_ether_deltas,canonical_transaction_fees,canonical_transaction_fees_ether_deltas,canonical_block_author,canonical_miner_fees_ether_deltas,canonical_receipts,canonical_receipt_erc20_deltas' \
    ['non-fungible-balance-processor']='non_fungible_balance_delta,non_fungible_balance,canonical_receipts,canonical_receipt_erc721_deltas,' \
    ['transaction-fees-processor']='canonical_transactions,canonical_receipts,canonical_gas_prices,canonical_gas_used,' \
  )

  for processor in "${!topics[@]}"; do
    docker-compose exec kafka-1 sh -c "kafka-streams-application-reset --zookeeper zookeeper:2181 --bootstrap-servers kafka-1:9091 --application-id ${processor} --input-topics ${topics[${processor}]}"
  done

}

run() {
  local command="${1:-false}"

  case "${command}" in
    ensure-topics) create_topics       ;;
    list-topics)   list_topics         ;;
    reset-streams)  reset_streams      ;;
    help|*)        kafka_usage; exit 0 ;;
  esac
}
run "$@"
