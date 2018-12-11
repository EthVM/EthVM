import { Uncle } from 'ethvm-common'

const toUncle = (uncle: any): Uncle => {
  const u: any = {}
  u.sha3Uncles = uncle.sha3Uncles
  u.uncleHeight = uncle.uncleHeight
  u.blockHeight = uncle.blockHeight
  u.position = uncle.position
  u.hash = uncle.hash
  u.parentHash = uncle.parentHash
  u.timestamp = uncle.timestamp
  u.nonce = uncle.nonce
  u.miner = uncle.miner
  if (uncle.rewards) {
    for (const address in uncle.rewards) {
      if (uncle.rewards[address]) {
        uncle.rewards[address] = parseFloat(uncle.rewards[address])
      }
    }
    u.rewards = uncle.rewards
  }
  u.difficulty = parseFloat(uncle.difficulty)
  u.totalDifficulty = parseFloat(uncle.totalDifficulty)
  if (uncle.stateRoot) {
    u.stateRoot = uncle.stateRoot.buffer
  }
  if (uncle.transactionsRoot) {
    u.transactionsRoot = uncle.transactionsRoot.buffer
  }
  if (uncle.receiptsRoot) {
    u.receiptsRoot = uncle.receiptsRoot.buffer
  }
  if (uncle.logsBloom) {
    u.logsBloom = uncle.logsBloom.buffer
  }
  u.gasLimit = parseFloat(uncle.gasLimit)
  u.gasUsed = parseFloat(uncle.gasUsed)
  if (uncle.mixHash) {
    u.mixHash = uncle.mixHash.buffer
  }
  if (uncle.extraData) {
    u.extraData = uncle.extraData.buffer
  }
  return u
}

export { toUncle }
