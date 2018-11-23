import { Uncle } from 'ethvm-common'

const toUncle = (uncle: any): Uncle => {
  const u: any = {}
  u.unclesHash = uncle.unclesHash
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
  u.stateRoot = uncle.stateRoot.buffer
  u.transactionsRoot = uncle.transactionsRoot.buffer
  u.receiptsRoot = uncle.receiptsRoot.buffer
  u.logsBloom = uncle.logsBloom.buffer
  u.gasLimit = parseFloat(uncle.gasLimit)
  u.gasUsed = parseFloat(uncle.gasUsed)
  u.mixHash = uncle.mixHash.buffer
  u.extraData = uncle.extraData.buffer
  return u
}

export { toUncle }
