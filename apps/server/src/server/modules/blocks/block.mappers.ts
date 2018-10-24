import { Block } from 'ethvm-models'

const toBlock = (block: any): Block => {
  const b: any = {}
  b.header = {}
  if (block.header.parentHash) {
    b.header.parentHash = block.header.parentHash
  }
  if (block.header.unclesHash) {
    b.header.unclesHash = block.header.unclesHash
  }
  if (block.header.timestamp) {
    b.header.timestamp = block.header.timestamp
  }
  if (block.header.nonce) {
    b.header.nonce = block.header.nonce.buffer
  }
  if (block.header.miner) {
    b.header.miner = block.header.miner
  }
  if (block.header.difficulty) {
    b.header.difficulty = block.header.difficulty.buffer
  }
  if (block.header.totalDifficulty) {
    b.header.totalDifficulty = block.header.totalDifficulty.buffer
  }
  if (block.header.stateRoot) {
    b.header.stateRoot = block.header.stateRoot.buffer
  }
  if (block.header.transactionsRoot) {
    b.header.transactionsRoot = block.header.transactionsRoot.buffer
  }
  if (block.header.receiptsRoot) {
    b.header.receiptsRoot = block.header.receiptsRoot.buffer
  }
  if (block.header.logsBloom) {
    b.header.logsBloom = block.header.logsBloom.buffer
  }
  if (block.header.gasLimit) {
    b.header.gasLimit = block.header.gasLimit.buffer
  }
  if (block.header.gasUsed) {
    b.header.gasUsed = block.header.gasUsed
  }
  if (block.header.mixHash) {
    b.header.mixHash = block.header.mixHash.buffer
  }
  if (block.header.extraData) {
    b.header.extraData = block.header.extraData.buffer
  }
  if (block.header.rewards) {
    for (const address in block.header.rewards) {
      if (block.header.rewards[address]) {
        block.header.rewards[address] = block.header.rewards[address].buffer
      }
    }
    b.header.rewards = block.header.rewards
  }

  b.stats = {}
  if (block.stats.blockTimeMs) {
    b.stats.blockTimeMs = block.stats.blockTimeMs
  }
  if (block.stats.successfulTxs) {
    b.stats.successfulTxs = block.stats.successfulTxs
  }
  if (block.stats.failedTxs) {
    b.stats.failedTxs = block.stats.failedTxs
  }
  if (block.stats.txs) {
    b.stats.txs = block.stats.txs
  }
  if (block.stats.internalTxs) {
    b.stats.internalTxs = block.stats.internalTxs
  }
  if (block.stats.avgGasPrice) {
    b.stats.avgGasPrice = block.stats.avgGasPrice.buffer
  }
  if (block.stats.avgTxsFees) {
    b.stats.avgTxsFees = block.stats.avgTxsFees.buffer
  }
  if (block.stats.totalGasPrice) {
    b.stats.totalGasPrice = block.stats.totalGasPrice.buffer
  }
  if (block.stats.totalTxsFees) {
    b.stats.totalTxsFees = block.stats.totalTxsFees.buffer
  }

  b.number = block.number
  b.hash = block.hash
  b.transactions = block.transactions
  b.uncles = block.uncles
  return b
}

export { toBlock }
