// drop collections

const collections = [
  'blocks',
  'transactions',
  'contract',
  'balances',
  "uncles",
  'accounts',
  "token_transfers",
  'pending',
  'pending_transactions',
  'aggregate_block_metrics',
  "exchange_rates"
];

collections.forEach(name => db[name].drop());
