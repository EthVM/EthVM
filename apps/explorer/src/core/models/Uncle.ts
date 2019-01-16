import { Hex } from '@app/core/models'
import { Uncle as RawUncle } from 'ethvm-common'

export class Uncle {
  public readonly id: string
  private cache: any

  constructor(private readonly uncle: RawUncle) {
    this.cache = {}
    this.id = this.uncle.hash
  }

  public isUncle(): boolean {
    return true
  }

  public getId(): string {
    return this.id
  }

  // TODO: Fix Decimal128
  public getNumber(): number {
    // return this.uncle.number
    return 0
  }

  public getBlockHeight(): number {
    // return this.uncle.blockHeight
    return 0
  }

  public getPosition(): number {
    // return this.uncle.position
    return 0
  }

  public getType(): string {
    return 'uncle'
  }

  public getParentHash(): string {
    return '0x' + this.uncle.parentHash
  }

  public getHash(): string {
    return '0x' + this.uncle.hash
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

  public getMiner(): string {
    return '0x' + this.uncle.author
  }

  // TODO: Optimize Decimal128
  public getTotalDifficulty(): number {
    // if (!this.cache.totalDifficulty) {
    //   this.cache.totalDifficulty = this.uncle.totalDifficulty
    // }
    // return this.cache.totalDifficulty
    return 0
  }

  public getDifficulty(): number {
    if (!this.cache.difficulty) {
      this.cache.difficulty = this.uncle.difficulty
    }
    return this.cache.difficulty
  }

  public getStateRoot(): string {
    return this.uncle.stateRoot ? '0x' + this.uncle.stateRoot : ''
  }

  public getTransactionsRoot(): string {
    return this.uncle.transactionsRoot ? '0x' + this.uncle.transactionsRoot : ''
  }

  public getReceiptsRoot(): string {
    return this.uncle.receiptsRoot ? '0x' + this.cache.receiptsRoot : ''
  }

  public getLogsBloom(): string {
    return this.uncle.logsBloom ? '0x' + this.uncle.logsBloom : ''
  }

  // TODO: Decimal128
  public getGasLimit(): number {
    // return this.uncle.gasLimit
    return 0
  }

  // TODO: Decimal128
  public getGasUsed(): number {
    // return this.uncle.gasUsed
    return 0
  }

  public getExtraData(): string {
    return this.uncle.extraData ? '0x' + this.uncle.extraData : ''
  }

  public getMinerReward(): number {
    // const rewards = this.uncle.rewards
    // if (!this.cache.getMinerReward) {
    //   this.cache.getMinerReward = rewards[this.uncle.miner]
    // }
    // return this.cache.getMinerReward
    return 0
  }

  public getTotalReward(): number {
    // if (!this.cache.getTotalReward) {
    //   let total = 0
    //   for (const address in this.uncle.rewards) {
    //     total = this.uncle.rewards[address] + total
    //   }
    //   this.cache.getTotalReward = total
    // }
    // return this.cache.getTotalReward
    return 0
  }

  // uncle reward =  total reward - block reward
  public getUncleReward(): number {
    // if (!this.cache.getReward) {
    //   let total = 0
    //   for (const address in this.uncle.rewards) {
    //     total = this.uncle.rewards[address] + total
    //   }
    //   this.cache.getReward = total - this.uncle.rewards[this.uncle.miner]
    // }
    // return this.cache.getReward
    return 0
  }
}
