import { common } from '@app/helpers'
import { Hash, Hex } from '@app/models'
import { Uncle as UncleLayout } from 'ethvm-common'

export class Uncle {
  public readonly id: string
  private readonly uncle: UncleLayout
  private cache: any

  constructor(uncle: UncleLayout) {
    this.cache = {}
    this.uncle = uncle
    this.id = this.uncle.unclesHash
  }

  public getId(): string {
    return this.id
  }

  public getNumber(): number {
    return 0    // TBD: Height of Uncle
  }

  public getType(): string {
    return 'uncle'
  }

  public getParentHash(): string {
    if (!this.cache.parentHash) {
      this.cache.parentHash = this.uncle.parentHash
    }
    return this.cache.parentHash
  }

  public getHash(): string {
    if (!this.cache.unclesHash) {
      this.cache.unclesHash = this.uncle.unclesHash
    }
    return this.cache.unclesHash
  }

  public getTimestamp(): Date {
    if (!this.cache.timestamp) {
      this.cache.timestamp = this.uncle.timestamp
    }
    return new Date(this.cache.timestamp * 1000)
  }

  public getIsUncle(): boolean{
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
      this.cache.miner = this.uncle.miner
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
      this.cache.stateRoot = this.uncle.stateRoot
    }
    return this.cache.stateRoot
  }

  public getTransactionsRoot(): Hash {
    if (!this.cache.transactionsRoot) {
      this.cache.transactionsRoot = common.Hash(this.uncle.transactionsRoot)
    }
    return this.cache.transactionsRoot
  }

  public getReceiptsRoot(): Hash {
    if (!this.cache.receiptsRoot) {
      this.cache.receiptsRoot = common.Hash(this.uncle.receiptsRoot)
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

  public getGasUsed(): number {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = this.uncle.gasUsed
    }
    return this.cache.gasUsed
  }

  public getMixHash(): Hash {
    if (!this.cache.mixHash) {
      this.cache.mixHash = common.Hash(this.uncle.mixHash)
    }
    return this.cache.mixHash
  }

  public getExtraData(): Hex {
    if (!this.cache.extraData) {
      this.cache.extraData = common.Hex(this.uncle.extraData)
    }
    return this.cache.extraData
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
}
