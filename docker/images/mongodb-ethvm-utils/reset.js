// drop collections

const collections = [
  'blocks',
  'transactions',
  'contract',
  'balances',
  'accounts',
  'pending',
  'pending_transactions',
  'statistics'
];

collections.forEach(name => db[name].drop());
