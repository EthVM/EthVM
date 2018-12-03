#!/usr/bin/env bash

set -o errexit
# set -o nounset
# set -o xtrace
# set -o verbose

# Give script sane defaults
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(cd ${SCRIPT_DIR}/..; pwd)

# monkey_usage - prints monkey subcommand usage
monkey_usage() {
  echo ""
  echo "Utility to generate random transactions to a defined RPC endpoint."
  echo ""
  echo "Usage:"
  echo "  ethvm monkey [COMMAND] [ARGS...]"
  echo ""
  echo "Options:"
  echo "  ethvm monkey --help|-h         Print this help information and exit."
  echo ""
  echo "Commands:"
  echo "  random                         Generates random transactions."
  echo "  deploy                         Deploy a Smart Contract to the specified network."
  echo "  contract-address <tx-hash>     Returns the smart contract address of the specified tx hash."
  echo "  balance <address>              Returns the balance of the specified address."
  echo "  confirm <tx-hash>              Restart docker services."
  echo ""
}

# ensure - checks that whe have needed utilities installed on our system
ensure() {
  if ! [ -x "$(command -v yarn)" ]; then
    >&2 echo "yarn is necessary to be installed to run this script!"
    exit 1
  fi
}
ensure

exec yarn --cwd ${ROOT_DIR}/bin/monkey monkey "$@"
