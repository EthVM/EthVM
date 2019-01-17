import { EthValue, HexNumber, Hex, Hash } from '@app/core/models'
import BN from 'bignumber.js'
import { Block as RawBlock, BlockStats, Reward } from 'ethvm-common'

export class Block {
  private readonly id: string
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

  public getParentHash(): Hex {
    if (!this.cache.parentHash) {
      this.cache.parentHash = new Hex(this.block.header.parentHash)
    }
    return this.cache.parentHash
  }

  // TODO; Review value
  public getNonce(): Hex {
    if (!this.cache.nonce) {
      this.cache.nonce = new Hex(this.block.header.nonce)
    }
    return this.cache.nonce
  }

  public getSha3Uncles(): Hex {
    if (!this.cache.sha3Uncles) {
      this.cache.sha3Uncles = new Hex(this.block.header.sha3Uncles)
    }
    return this.cache.sha3Uncles
  }

  public getLogsBloom(): Hex {
    if (!this.cache.logsBloom) {
      this.cache.logsBloom = new Hex(this.block.header.logsBloom)
    }
    return this.cache.logsBloom
  }

  public getStateRoot(): Hex {
    if (!this.cache.stateRoot) {
      this.cache.stateRoot = new Hex(this.block.header.stateRoot)
    }
    return this.cache.stateRoot
  }

  public getMiner(): Hex {
    if (!this.cache.miner) {
      this.cache.miner = new Hex(this.block.header.author)
    }
    return this.cache.miner
  }

  public getDifficulty(): HexNumber {
    if (!this.cache.difficulty) {
      this.cache.difficulty = new HexNumber(this.block.header.difficulty)
    }
    return this.cache.difficulty
  }

  public getTotalDifficulty(): HexNumber {
    if (!this.cache.totalDifficulty) {
      this.cache.totalDifficulty = new HexNumber(this.block.totalDifficulty)
    }
    return this.cache.totalDifficulty
  }

  public getExtraData(): string {
    return this.block.header.extraData ? this.block.header.extraData : ''
  }

  public getGasLimit(): HexNumber {
    if (!this.cache.gasLimit) {
      this.cache.garLimit = new HexNumber(this.block.header.gasUsed)
    }
    return this.cache.garLimit
  }

  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = new HexNumber(this.block.header.gasUsed)
    }
    return this.cache.gasUsed
  }

  public getTimestamp(): Date {
    return new Date(this.block.header.timestamp * 1000)
  }

  public getTransactionsRoot(): Hash {
    if (!this.cache.transactionsRoot) {
      this.cache.transactionsRoot = new Hash(this.block.header.transactionsRoot)
    }
    return this.cache.transactionsRoot
  }

  public getReceiptsRoot(): Hash {
    if (!this.cache.receiptsRoot) {
      this.cache.receiptsRoot = new Hash(this.block.header.receiptsRoot)
    }
    return this.cache.receiptsRoot
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
      const rawReward = rewards.length > 0 ? rewards[0].reward : '0'
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
        const rawReward = this.block.rewards[i].reward || '0'
        total = total.plus(new BN(rawReward))
      }
      this.cache.getTotalReward = new EthValue(total.toString())
    }
    return this.cache.getTotalReward
  }

  public getStats(): BlockStats {
    return this.block.stats
  }
}
