import { EthValue } from '@app/core/models'
import { Block as RawBlock, BlockStats, Reward } from 'ethvm-common'
import BN from 'bignumber.js'

export class Block {
  public readonly id: string
  private cache: any = {}

  constructor(private readonly block: RawBlock) {
    this.id = this.block.header.hash
  }

  public getId(): string {
    return this.id
  }

  public isUncle(): boolean {
    return false
  }

  public getType(): string {
    return 'block'
  }

  public getUncles(): string[] {
    if (!this.cache.getUncles) {
      const uncles = []
      if (this.block.uncles) {
        this.block.uncles.forEach(b => uncles.push('0x' + b.hash))
      }
      this.cache.getUncles = uncles
    }
    return this.cache.getUncles
  }

  public getHash(): string {
    return '0x' + this.block.header.hash
  }

  public getNumber(): number {
    if (!this.cache.number) {
      this.cache.number = new BN(this.block.header.number).toNumber()
    }
    return this.cache.number
  }

  public getTransactionCount(): number {
    return this.block.transactions ? this.block.transactions.length : 0
  }

  public getParentHash(): string {
    return '0x' + this.block.header.parentHash
  }

  public getNonce(): string {
    return this.block.header.nonce
  }

  public getSha3Uncles(): string {
    return '0x' + this.block.header.sha3Uncles
  }

  public getLogsBloom(): string {
    return '0x' + this.block.header.logsBloom
  }

  public getStateRoot(): string {
    return '0x' + this.block.header.stateRoot
  }

  public getMiner(): string {
    return '0x' + this.block.header.author
  }

  public getDifficulty(): number {
    if (!this.cache.difficulty) {
      this.cache.difficulty = new BN(this.block.header.difficulty).toNumber()
    }
    return this.cache.difficulty
  }

  public getTotalDifficulty(): number {
    if (!this.cache.totalDifficulty) {
      this.cache.totalDifficulty = new BN(this.block.totalDifficulty).toNumber()
    }
    return this.cache.totalDifficulty
  }

  public getExtraData(): string {
    return this.block.header.extraData ? this.block.header.extraData : ''
  }

  public getGasLimit(): number {
    if (!this.cache.gasLimit) {
      this.cache.garLimit = new BN(this.block.header.gasUsed).toNumber()
    }
    return this.cache.garLimit
  }

  public getGasUsed(): number {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = new BN(this.block.header.gasUsed).toNumber()
    }
    return this.cache.gasUsed
  }

  public getTimestamp(): Date {
    return new Date(this.block.header.timestamp * 1000)
  }

  public getTransactionsRoot(): string {
    return this.block.header.transactionsRoot ? '0x' + this.block.header.transactionsRoot : ''
  }

  public getReceiptsRoot(): string {
    return this.block.header.receiptsRoot ? '0x' + this.block.header.receiptsRoot : ''
  }

  public getTxFees(): number {
    return this.block.stats.totalTxsFees
  }

  public getRewards(): Reward[] {
    return this.block.rewards || []
  }

  public getMinerReward(): EthValue {
    if (!this.cache.minerReward) {
      const rewards = this.getRewards()
      const rawReward = rewards.length > 1 ? rewards[0].reward : '0'
      this.cache.minerReward = new EthValue(rawReward)
    }
    return this.cache.minerReward
  }

  public getUncleReward(): EthValue {
    if (!this.cache.uncleReward) {
      const rewards = this.getRewards()
      const rawReward = rewards.length > 1 ? rewards[1].reward : '0'
      this.cache.uncleReward = new EthValue(rawReward)
    }
    return this.cache.uncleReward
  }

  public getTotalReward(): EthValue {
    if (!this.cache.getTotalReward) {
      let total = new BN(0)
      for (const i in this.getRewards()) {
        total = total.plus(new BN(this.block.rewards[i].reward))
      }
      this.cache.getTotalReward = new EthValue(total.toString())
    }
    return this.cache.getTotalReward
  }

  public getStats(): BlockStats {
    return this.block.stats
  }
}
