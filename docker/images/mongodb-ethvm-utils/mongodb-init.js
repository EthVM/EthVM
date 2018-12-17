// create collections

const collections = [
  "web3_blocks",
  "blocks",
  "transactions",
  "contracts",
  "fungible_balances",
  "non_fungible_balances",
  "pending_transactions",
  "block_statistics"
];

collections.forEach(name => db.createCollection(name));
