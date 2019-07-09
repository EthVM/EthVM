#!/usr/bin/env sh

set -o xtrace

PARITY="/home/parity/parity"
PARITY_CHAIN=${PARITY_CHAIN:-"mainnet"}

case "$PARITY_CHAIN" in
  mainnet)
    $PARITY --tracing on --pruning archive --ws-interface 0.0.0.0 --ws-origins='*' --ws-hosts='*' --jsonrpc-interface 0.0.0.0 --min-peers $PARITY_MIN_PEERS --max-peers $PARITY_MAX_PEERS
  ;;
  ropsten)
    $PARITY --chain $PARITY_CHAIN --tracing on --pruning archive --ws-interface 0.0.0.0 --ws-origins='*' --ws-hosts='*' --jsonrpc-interface 0.0.0.0 --min-peers $PARITY_MIN_PEERS --max-peers $PARITY_MAX_PEERS
  ;;
  private)
    $PARITY --config dev-insecure --reseal-min-period 10000 -lminer=trace --ws-apis all --tracing on --pruning archive --ws-interface 0.0.0.0 --ws-origins='*' --ws-hosts='*' --jsonrpc-interface 0.0.0.0 --min-peers $PARITY_MIN_PEERS --max-peers $PARITY_MAX_PEERS
  ;;
  *)
    echo "Invalid PARITY_CHAIN = $PARITY_CHAIN selected!"
    exit 1
  ;;
esac
