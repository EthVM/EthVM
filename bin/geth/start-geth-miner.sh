#!/bin/zsh
set -eu

if [ -n "`$SHELL -c 'echo $ZSH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${(%):-%x}" )" && pwd )"
elif [ -n "`$SHELL -c 'echo $BASH_VERSION'`" ]; then
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fi

GETH_DIR=$SCRIPT_DIR/tmp/private-net

printf 'Creating private network directory...\n'
rm -rf $GETH_DIR
mkdir -p ${GETH_DIR}/keystore
cp -r $SCRIPT_DIR/keystore/ ${GETH_DIR}/keystore/

printf 'Creating custom genesis.json!\n'
geth --datadir $GETH_DIR init $SCRIPT_DIR/genesis.json

# printf 'Starting geth node!\n'
geth --datadir $GETH_DIR \\
  --verbosity 5 \\
  --identity geth-miner
  --networkid 1234 \\
  --mine --minerthreads 1 \\
  --rpc --rpcaddr '0.0.0.0' --rpccorsdomain '*' --rpcapi 'admin,personal,db,eth,net,web3,txpool,miner' \\
  --nodiscover --maxpeers 2
  --nousb \\
  --unlock '84baabad835e6ca9252658cd6eae0152f6330c09' \\
  --password =(echo '123456789') \\
  --nodekeyhex '08f0e1dee5c1b4645f3331a566009e41a4514b6cd28656d63d0449ecf812812b'
