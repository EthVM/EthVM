import { Block } from 'ethvm-common'

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
    b.header.nonce = block.header.nonce
  }
  if (block.header.miner) {
    b.header.miner = block.header.miner
  }
  if (block.header.difficulty) {
    b.header.difficulty = parseFloat(block.header.difficulty)
  }
  if (block.header.totalDifficulty) {
    b.header.totalDifficulty = parseFloat(block.header.totalDifficulty)
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
    b.header.gasLimit = parseFloat(block.header.gasLimit)
  }
  if (block.header.gasUsed) {
    b.header.gasUsed = parseFloat(block.header.gasUsed)
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
        block.header.rewards[address] = parseFloat(block.header.rewards[address])
      }
    }
    b.header.rewards = block.header.rewards
  }

  b.stats = {}
  b.stats.processingTimeMs = block.stats.processingTimeMs || 0
  b.stats.successfulTxs = block.stats.successfulTxs || 0
  b.stats.failedTxs = block.stats.failedTxs || 0
  b.stats.pendingTxs = block.stats.pendingTxs || 0
  b.stats.txs = block.stats.txs || 0
  b.stats.internalTxs = block.stats.internalTxs || 0
  if (block.stats.avgGasPrice) {
    b.stats.avgGasPrice = parseFloat(block.stats.avgGasPrice)
  }
  if (block.stats.avgTxsFees) {
    b.stats.avgTxsFees = parseFloat(block.stats.avgTxsFees)
  }
  if (block.stats.totalGasPrice) {
    b.stats.totalGasPrice = parseFloat(block.stats.totalGasPrice)
  }
  if (block.stats.totalTxsFees) {
    b.stats.totalTxsFees = parseFloat(block.stats.totalTxsFees)
  }

  b.number = block.number
  b.hash = block.hash
  b.transactions = block.transactions
  b.uncles = block.uncles
  return b
}

export { toBlock }
