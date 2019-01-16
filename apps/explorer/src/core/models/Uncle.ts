import { Hash, Hex } from '@app/core/models'
import { Uncle as RawUncle } from 'ethvm-common'

export class Uncle {
  public readonly id: string
  private cache: any

  constructor(private readonly uncle: RawUncle) {
    this.cache = {}
    this.id = this.uncle.hash
  }

  public getId(): string {
    return this.id
  }

  public getNumber(): number {
    return this.uncle.uncleHeight
  }

  public getBlockHeight(): number {
    return this.uncle.blockHeight
  }
  public getPosition(): number {
    return this.uncle.position
  }

  public getType(): string {
    return 'uncle'
  }

  public getParentHash(): string {
    if (!this.cache.parentHash) {
      this.cache.parentHash = '0x' + this.uncle.parentHash
    }
    return this.cache.parentHash
  }

  public getHash(): string {
    if (!this.cache.hash) {
      this.cache.hash = '0x' + this.uncle.hash
    }
    return this.cache.hash
  }

  public getTimestamp(): Date {
    if (!this.cache.timestamp) {
      this.cache.timestamp = this.uncle.timestamp
    }
    return new Date(this.cache.timestamp * 1000)
  }

  public getIsUncle(): boolean {
    if (!this.cache.getIsUncle) {
      this.cache.getIsUncle = true
    }
    return this.cache.getIsUncle
  }

  public getNonce(): Hex {
    if (!this.cache.nonce) {
      this.cache.nonce = this.uncle.nonce
    }
    return this.cache.nonce
  }

  public getMiner(): string {
    if (!this.cache.miner) {
      this.cache.miner = '0x' + this.uncle.miner
    }
    return this.cache.miner
  }

  public getTotalDifficulty(): number {
    if (!this.cache.totalDifficulty) {
      this.cache.totalDifficulty = this.uncle.totalDifficulty
    }
    return this.cache.totalDifficulty
  }

  public getDifficulty(): number {
    if (!this.cache.difficulty) {
      this.cache.difficulty = this.uncle.difficulty
    }
    return this.cache.difficulty
  }

  public getStateRoot(): Hash {
    if (!this.cache.stateRoot) {
      this.cache.stateRoot = new Hex(this.uncle.stateRoot)
    }
    return this.cache.stateRoot
  }

  public getTransactionsRoot(): Hash {
    if (!this.cache.transactionsRoot) {
      this.cache.transactionsRoot = new Hash(this.uncle.transactionsRoot)
    }
    return this.cache.transactionsRoot
  }

  public getReceiptsRoot(): Hash {
    if (!this.cache.receiptsRoot) {
      this.cache.receiptsRoot = new Hash(this.uncle.receiptsRoot)
    }
    return this.cache.receiptsRoot
  }

  public getLogsBloom(): Hex {
    if (!this.cache.logsBloom) {
      this.cache.logsBloom = this.uncle.logsBloom
    }
    return this.cache.logsBloom
  }

  public getGasLimit(): number {
    if (!this.cache.gasLimit) {
      this.cache.garLimit = this.uncle.gasLimit
    }
    return this.cache.garLimit
  }

  public getHasUncle(): boolean {
    return false
  }

  public getGasUsed(): number {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = this.uncle.gasUsed
    }
    return this.cache.gasUsed
  }

  public getExtraData(): Hex {
    if (!this.cache.extraData) {
      this.cache.extraData = new Hex(this.uncle.extraData)
    }
    return this.cache.extraData
  }

  public getMinerReward(): number {
    const rewards = this.uncle.rewards
    if (!this.cache.getMinerReward) {
      this.cache.getMinerReward = rewards[this.uncle.miner]
    }
    return this.cache.getMinerReward
  }

  public getTotalReward(): number {
    if (!this.cache.getTotalReward) {
      let total = 0
      for (const address in this.uncle.rewards) {
        total = this.uncle.rewards[address] + total
      }
      this.cache.getTotalReward = total
    }
    return this.cache.getTotalReward
  }

  // uncle reward =  total reward - block reward
  public getUncleReward(): number {
    if (!this.cache.getReward) {
      let total = 0
      for (const address in this.uncle.rewards) {
        total = this.uncle.rewards[address] + total
      }
      this.cache.getReward = total - this.uncle.rewards[this.uncle.miner]
    }
    return this.cache.getReward
  }
}
