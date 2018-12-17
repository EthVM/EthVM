// drop collections

const collections = [
  'blocks',
  'transactions',
  'contract',
  'fungible_balances',
  'non_fungible_balances',
  'accounts',
  'pending',
  'pending_transactions',
  'statistics'
]

collections.forEach(name => db[name].drop());
