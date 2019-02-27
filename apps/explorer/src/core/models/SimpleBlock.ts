import { EthValue, Hex, SimpleTx, Uncle } from '@app/core/models'
import BN from 'bignumber.js'
import { Block as RawBlock, Reward } from 'ethvm-common'

export class SimpleBlock {
  private readonly id: string
  private cache: any = {}

  constructor(private readonly block: RawBlock) {
    this.id = new Hex(this.block.header.hash).toString()
  }

  public getId(): string {
    return this.id
  }

  public getUncles(): Uncle[] {
    if (!this.cache.uncles) {
      const rawUncles = this.block.uncles || []
      this.cache.uncles = rawUncles.map(rawUncle => new Uncle(rawUncle))
    }
    return this.cache.uncles
  }

  public getHash(): string {
    return this.id
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

  public getMiner(): Hex {
    if (!this.cache.miner) {
      this.cache.miner = new Hex(this.block.header.author)
    }
    return this.cache.miner
  }

  public getTimestamp(): Date {
    return new Date(this.block.header.timestamp * 1000)
  }

  public getTxFees(): EthValue {
    if (!this.cache.totalTxsFees) {
      const txs = this.getTxs()
      const txsCost = txs.length > 0 ? txs.map(tx => tx.getTxCost().toGWei()).reduceRight((acc, value) => acc + value) : 0
      this.cache.totalTxsFees = new EthValue(txsCost)
    }
    return this.cache.totalTxsFees
  }

  public getRewards(): Reward[] {
    return this.block.rewards || []
  }

  public getTotalReward(): EthValue {
    if (!this.cache.minerReward) {
      const rawReward = this.getRewards()
        .filter(r => r.rewardType === 'block')
        .map(r => r.value)
        .reduce((acc, value: any) => value, 0)
      this.cache.minerReward = new EthValue(rawReward)
    }
    return this.cache.minerReward
  }

  public getTxs(): SimpleTx[] {
    if (!this.cache.txs) {
      const rawTxs = this.block.transactions || []
      this.cache.txs = rawTxs.map(rawTx => new SimpleTx(rawTx))
    }
    return this.cache.txs
  }
}
