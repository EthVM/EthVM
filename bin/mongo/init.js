
use ethvm_local;

db.createCollection('accounts');
db.createCollection('blocks');
db.createCollection('pending_transactions');

// create indexes

db.blocks.createIndex({ hash: 1 }, { unique: 1 });
db.blocks.createIndex({ 'header.timestamp': 1 });
db.blocks.createIndex({ 'header.miner': 1 });
db.blocks.createIndex({ 'uncles.parentHash': 1 });
db.blocks.createIndex({ 'uncles.miner': 1 });
db.blocks.createIndex({ 'uncles.parentHash': 1 });
db.blocks.createIndex({ 'transactions.hash': 1 });

db.statistics.createIndex({ 'name': 1, 'date': 1});

// create views

db.createView('transactions', 'blocks', [
  { $sort: { _id: -1 }},
  { $unwind: { path: '$transactions', includeArrayIndex: "index" } },
  { $project: { hash: 1, number: 1, timestamp: 1, transactions: 1 } }
  ]);

db.createView('uncles', 'blocks', [
  { $sort: { _id: -1 }},
  { $unwind: { path: '$uncles', includeArrayIndex: "index" } },
  { $project: { hash: 1, number: 1, timestamp: 1, uncles: 1 } }
]);
