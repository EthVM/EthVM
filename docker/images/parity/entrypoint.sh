#!/bin/sh

set -o xtrace

case $PARITY_CHAIN in
  ropsten)
    /home/parity/parity --chain ${PARITY_CHAIN} --tracing on --pruning archive --ws-interface 0.0.0.0 --ws-origins='*' --ws-hosts='*' --jsonrpc-interface 0.0.0.0 --min-peers ${PARITY_MIN_PEERS} --max-peers ${PARITY_MAX_PEERS}
  ;;
  private)
    /home/parity/parity --config dev-insecure --reseal-min-period 10000 -lminer=trace --ws-apis all --tracing on --pruning archive --ws-interface 0.0.0.0 --ws-origins='*' --ws-hosts='*' --jsonrpc-interface 0.0.0.0 --min-peers ${PARITY_MIN_PEERS} --max-peers ${PARITY_MAX_PEERS}
  ;;
  *)
    echo "Invalid PARITY_CHAIN == $PARITY_CHAIN selected!"
    exit 1
  ;;
esac
