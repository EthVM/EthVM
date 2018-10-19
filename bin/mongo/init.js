
use ethvm_local;

// create collections

db.createCollection('accounts');
db.createCollection('blocks');
db.createCollection('pending_transactions');
db.createCollection('statistics');

// create indexes

db.blocks.createIndex({ hash: 1 }, { unique: 1 });
db.blocks.createIndex({ 'header.timestamp': 1 });
db.blocks.createIndex({ 'header.miner': 1 });
db.blocks.createIndex({ 'uncles.parentHash': 1 });
db.blocks.createIndex({ 'uncles.miner': 1 });
db.blocks.createIndex({ 'transactions.hash': 1 });
db.blocks.createIndex({ 'transactions.from': 1 });
db.blocks.createIndex({ 'transactions.to': 1 });
db.blocks.createIndex({ 'transactions.contractAddress': 1 });

db.statistics.createIndex({ 'name': 1, 'date': 1});

// create views

db.createView('transactions', 'blocks', [
  { $sort: { _id: -1 } },
  { $unwind: { path: '$transactions', includeArrayIndex: "index" } },
  { $project: { hash: 1, number: 1, timestamp: '$header.timestamp', index: 1, transaction: '$transactions' } },
  {
    $addFields: {
      'transaction.blockHash': '$hash',
      'transaction.blockNumber': '$number',
      'transaction.index': '$index',
      'transaction.timestamp': '$timestamp'
    }
  },
  {
    $project: {
      blockHash: '$transaction.blockHash',
      blockNumber: '$transaction.blockNumber',
      hash: '$transaction.hash',
      timestamp: '$transaction.timestamp',
      index: '$transaction.index',
      nonce: '$transaction.nonce',
      from: '$transaction.from',
      to: '$transaction.to',
      contractAddress: '$transaction.contractAddress',
      status: '$transaction.status',
      data: '$transaction.data',
      fee: '$transaction.fee',
      logs: '$transaction.logs',
      result: '$transaction.result',
      gasPrice: '$transaction.gasPrice',
      gasLimit: '$transaction.gasLimit',
      gasUsed: '$transaction.gasUsed',
      gasRefund: '$transaction.gasRefund',
      gasLeftover: '$transaction.gasLeftover',
      traces: '$transaction.traces',
      v: '$transaction.v',
      r: '$transaction.r',
      s: '$transaction.s',
      value: '$transaction.value'
    }
  }
]);

db.createView('uncles', 'blocks', [
  { $sort: { _id: -1 } },
  { $unwind: { path: '$uncles', includeArrayIndex: "index" } },
  { $project: { hash: 1, number: 1, timestamp: '$header.timestamp', index: 1, uncle: '$uncles' } },
  {
    $addFields: {
      'uncle.timestamp': '$timestamp',
      'uncle.index': '$index',
    }
  },
  {
    $project: {
      parentHash: '$uncle.parentHash',
      unclesHash: '$uncle.unclesHash',
      timestamp: '$uncle.timestamp',
      nonce: '$uncle.nonce',
      miner: '$uncle.miner',
      rewards: '$uncle.rewards',
      difficulty: '$uncle.difficulty',
      totalDifficulty: '$uncle.totalDifficulty',
      stateRoot: '$uncle.stateRoot',
      transactionsRoot: '$uncle.transactionsRoot',
      receiptsRoot: '$uncle.receiptsRoot',
      logsBloom: '$uncle.logsBloom',
      gasLimit: '$uncle.gasLimit',
      gasUsed: '$uncle.gasUsed',
      mixHash: '$uncle.mixHash',
      extraData: '$uncle.extraData'
    }
  }
]);

db.createView('contracts', 'accounts', [
  { $sort: { _id: -1 } },
  { $match: { contract: { $eq: 1 } } },
  { $project : { address: 1, nonce: 1, balance: 1, contract: 0 } }
]);

db.createView('erc20_contracts', 'accounts', [
  { $sort: { _id: -1 } },
  { $match: { contract: { $eq: 1 } } },
  { $project : { address: 1, nonce: 1, balance: 1, contract: 1 } }
]);

db.createView('erc721_contracts', 'accounts', [
  { $sort: { _id: -1 } },
  { $match: { contract: { $eq: 2 } } },
  { $project : { address: 1, nonce: 1, balance: 1, contract: 2 } }
]);
