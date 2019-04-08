import { EthValue, Hex, HexNumber } from '@app/core/models'
import BN from 'bignumber.js'

export class Uncle {
  private readonly id: string
  private cache: any = {}

  constructor(private readonly uncle: any) {
    this.id = new Hex(this.uncle.hash).toString()
  }

  public getId(): string {
    return this.id
  }

  public getHash(): string {
    return this.id
  }

  public getNumber(): number {
    if (!this.cache.number) {
      this.cache.number = new BN(this.uncle.number).toNumber()
    }
    return this.cache.number
  }

  public getBlockHeight(): number {
    if (!this.cache.blockHeight) {
      this.cache.blockHeight = new BN(this.uncle.blockNumber).toNumber()
    }
    return this.cache.blockHeight
  }

  public getPosition(): number {
    return this.uncle.uncleIndex
  }

  public getParentHash(): Hex {
    if (!this.cache.parentHash) {
      this.cache.parentHash = new Hex(this.uncle.parentHash)
    }
    return this.cache.parentHash
  }

  public getTimestamp(): Date {
    return new Date(this.uncle.timestamp * 1000)
  }

  public getNonce(): Hex {
    if (!this.cache.nonce) {
      this.cache.nonce = this.uncle.nonce
    }
    return this.cache.nonce
  }

  public getMiner(): Hex {
    if (!this.cache.miner) {
      this.cache.miner = new Hex(this.uncle.author)
    }
    return this.cache.miner
  }

  public getSha3Uncles(): Hex {
    if (!this.cache.sha3Uncles) {
      this.cache.sha3Uncles = new Hex(this.uncle.sha3Uncles)
    }
    return this.cache.sha3Uncles
  }

  public getGasLimit(): HexNumber {
    if (!this.cache.gasLimit) {
      this.cache.garLimit = new HexNumber(this.uncle.gasLimit)
    }
    return this.cache.garLimit
  }

  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = new HexNumber(this.uncle.gasUsed)
    }
    return this.cache.gasUsed
  }

  public getDifficulty(): HexNumber {
    if (!this.cache.difficulty) {
      this.cache.difficulty = this.uncle.difficulty
    }
    return this.cache.difficulty
  }

  public getStateRoot(): Hex {
    if (!this.cache.stateRoot) {
      this.cache.stateRoot = new Hex(this.uncle.stateRoot)
    }
    return this.cache.stateRoot
  }

  public getExtraData(): Hex {
    if (!this.cache.extraData) {
      this.cache.extraData = new Hex(this.uncle.extraData)
    }
    return this.cache.extraData
  }

  public getTotalReward(): EthValue {
    return this.getUncleReward()
  }

  public getUncleReward(): EthValue {
    if (!this.cache.uncleReward) {
      this.cache.uncleReward = new EthValue(this.uncle.uncleReward || 0)
    }
    return this.cache.uncleReward
  }
}
