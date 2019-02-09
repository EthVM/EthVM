
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
  "token_exchange_rates",
  "account_metadata",
  "processing_metadata"
];

collections.forEach(name => db.createCollection(name));
