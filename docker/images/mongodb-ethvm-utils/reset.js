// drop collections

const collections = [
  'blocks',
  'transactions',
  'contract',
  'balances',
  'processing_metadata',
  "uncles",
  'accounts',
  "token_transfers",
  'pending',
  'pending_transactions',
  'aggregate_block_metrics',
  "token_exchange_rates",
  'processing_metadata'
];

collections.forEach(name => db[name].drop());
