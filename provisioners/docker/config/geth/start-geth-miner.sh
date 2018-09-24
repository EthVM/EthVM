#!/bin/zsh
set -eu

printf 'Creating custom genesis.json!\n'
geth --datadir '/geth' init /genesis.json

printf 'Starting geth node!\n'
geth --datadir '/geth' \\
  --verbosity 5 \\
  --identity geth-miner
  --networkid 1234 \\
  --mine --minerthreads 1 \\
  --rpc --rpcaddr '0.0.0.0' \\
  --nodiscover --maxpeers 2
  --nousb \\
  --unlock '84baabad835e6ca9252658cd6eae0152f6330c09' \\
  --password =(echo '123456789') \\
  --nodekeyhex '08f0e1dee5c1b4645f3331a566009e41a4514b6cd28656d63d0449ecf812812b'
