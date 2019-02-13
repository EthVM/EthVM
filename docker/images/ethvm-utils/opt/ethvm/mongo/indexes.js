const indexes = {

  blocks: [
    {key: {'header.hash': 1}, options: {unique: true}},
    {key: {'header.number': 1}},
    {key: {'header.author': 1}},
    {key: {'header.timestamp': 1}},
    {key: { totalDifficulty: 1 }}
  ],

  balances: [
    {key: { address: 1 }},
    {key: { balanceType: 1 }}
  ],

  aggregate_block_metrics: [
    {key: {name: 1}},
    {key: {date: 1}},
    {key: {date: 1, name: 1}, options: {unique: true}}
  ],

  contracts: [
    {key: {type: 1}},
    {key: {address: 1}},
    {key: {type: 1, address: 1}, options: {unique: true}},
  ],

  token_transfers: [
    {key: {transferType: 1}},
    {key: {from: 1}},
    {key: {to: 1}}
  ],

  token_exchange_rates: [
    {key: {address: 1}, options: {unique: true}},
    {key: {market_cap_rank: 1}},
    {key: {timestamp: 1}}
  ],

  transactions: [
    {key: {blockHash: 1}},
    {key: {blockNumber: 1}},
    {key: {from: 1}},
    {key: {to: 1}},
    {key: {timestamp: 1}}
  ]

};

function createIndexes(collectionId) { indexes[collectionId].forEach(params => db[collectionId].createIndex(params.key, params.options)) };

createIndexes('blocks');
createIndexes('balances');
createIndexes('aggregate_block_metrics');
createIndexes('contracts');
createIndexes('token_transfers');
createIndexes('token_exchange_rates');
createIndexes('transactions');
