#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# import utils
source ${SCRIPT_DIR}/utils.sh

# verify we have required utilities installed
ensure

# monkey_usage - prints monkey subcommand usage
monkey_usage() {
  echo ""
  echo "Utility to generate random transactions to a defined RPC endpoint."
  echo ""
  echo "Usage:"
  echo "  ethvm monkey [COMMAND] [ARGS...]"
  echo ""
  echo "Options:"
  echo "  ethvm monkey --help | -h         Print this help information and exit."
  echo ""
  echo "Commands:"
  echo "  random | r                       Generates random transactions."
  echo "  deploy | d [options]             Deploy a Smart Contract to the specified network."
  echo "  contract-address | ca <tx-hash>  Returns the smart contract address of the specified tx hash."
  echo "  balance | b <address>            Returns the balance of the specified address."
  echo "  confirm | cf <tx-hash>           Returns the balance of the specified address."
  echo ""
}

run() {
  exec yarn --cwd ${ROOT_DIR}/bin/monkey monkey "$@"
}
run "$@"
