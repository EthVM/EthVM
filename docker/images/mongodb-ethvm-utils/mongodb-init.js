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
  "block_statistics"
];

collections.forEach(name => db.createCollection(name));
