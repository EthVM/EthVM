import { EthValue, HexNumber, Hex, Hash, Tx, Uncle } from '@app/core/models'
import BN from 'bignumber.js'
import { Block as RawBlock, Reward } from 'ethvm-common'

export class Block {
  private readonly id: string
  private cache: any = {}

  constructor(private readonly block: RawBlock) {
    this.id = new Hex(this.block.header.hash).toString()
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

  public getParentHash(): Hex {
    if (!this.cache.parentHash) {
      this.cache.parentHash = new Hex(this.block.header.parentHash)
    }
    return this.cache.parentHash
  }

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

  public getExtraData(): Hex {
    if (!this.cache.extraData) {
      this.cache.extraData = new Hex(this.block.header.extraData)
    }
    return this.cache.extraData
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
      this.getRewards().forEach(r => (total = total.plus(new BN(r.reward || 0))))
      this.cache.getTotalReward = new EthValue(total.toString())
    }
    return this.cache.getTotalReward
  }

  public getTxs(): Tx[] {
    if (!this.cache.txs) {
      const rawTxs = this.block.transactions || []
      this.cache.txs = rawTxs.map(rawTx => new Tx(rawTx))
    }
    return this.cache.txs
  }
}
