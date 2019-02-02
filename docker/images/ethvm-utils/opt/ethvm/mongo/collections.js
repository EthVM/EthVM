
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
