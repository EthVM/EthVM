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
  'statistics'
];

collections.forEach(name => db[name].drop());
