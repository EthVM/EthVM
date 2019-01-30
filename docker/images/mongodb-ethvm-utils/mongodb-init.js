// create collections

const collections = [
  "web3_blocks",
  "blocks",
  "transactions",
  "contracts",
  "uncles",
  "balances",
  "token_transfers",
  "pending_transactions",
  "block_metrics",
  "aggregate_block_metrics",
  "account_metadata"
];

collections.forEach(name => db.createCollection(name));

const indexes = {

  blocks: [
    {key: {'header.hash': 1}, options: {unique: true}},
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

  transactions: [
    {key: {blockHash: 1}},
    {key: {blockNumber: 1}}
  ]

};

function createIndexes(collectionId) { indexes[collectionId].forEach(params => db[collectionId].createIndex(params.key, params.options)) };

createIndexes('blocks');
createIndexes('balances');
createIndexes('block_statistics');
createIndexes('contracts');
createIndexes('token_transfers');
createIndexes('transactions');
