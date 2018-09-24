#!/bin/zsh
set -eu

until $(curl --output /dev/null --silent --head --fail http://kafka-schema-registry:8081/subjects/raw-blocks-value/versions); do
  printf 'Waiting for Kafka Schema Registry to be ready...\n'
  sleep 3
done;

printf 'Creating custom genesis.json!\n'
geth --datadir '/geth' init /genesis.json

printf 'Starting geth node!\n'
geth --datadir '/geth' \\
  --verbosity 5 \\
  --identity geth
  --syncmode full \\
  --networkid 1234 \\
  --ethvm \\
  --gcmode archive \\
  --rpc --rpcaddr '0.0.0.0' --rpccorsdomain '*' --rpcapi 'admin,personal,db,eth,net,web3,txpool,miner' \\
  --nat 'extip:172.25.0.102' --nodiscover --maxpeers 2 \\
  --nousb
