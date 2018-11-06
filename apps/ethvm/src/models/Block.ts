import { common } from '@app/helpers'
import { Address, EthValue, Hash, Hex, HexNumber, HexTime, Tx } from '@app/models'
import { Block as BlockLayout, BlockStats } from 'ethvm-common'
import bn from 'bignumber.js'

export class Block {
  public readonly id: string
  private readonly block: BlockLayout
  private cache: any

  constructor(block: BlockLayout) {
    this.cache = {}
    this.block = block
    this.id = this.block.hash
  }

  public getId(): string {
    return this.id
  }

  // ony tx hash are there
  public setTransactions(txs: string[]): void {
    this.block.transactions = txs
  }

  public setIsUncle(isUncle: boolean): void {
    if (isUncle) {
      this.setTransactions([])
      this.setUncles([])
      //this.setUncleHashes([])
    }
    //this.block.isUncle = isUncle
  }

  public setUncles(uncles: string[]): void {
    // this.block.header.unclesHash = uncles
  }

  public addUncle(uncle: Block): void {
    if (!this.block.uncles) {
      this.block.uncles = []
    }
    //this.block.uncles.push(uncle)
  }

  public getIsUncle(): boolean {
    if (!this.cache.isUncle) {
      if (this.block.uncles.length == 0) {
        return (this.cache.isUncle = false)
      }
      return (this.cache.isUncle = true)
    }
    return this.cache.isUncle
  }

  // public getUncles(): Block[] {
  //   return this.block.uncles
  // }

  // public getUncleHashes(): Hash[] {
  //   return this.block.uncleHashes.map(_uncle => {
  //     return common.Hash(_uncle)
  //   })
  // }

  // public setUncleHashes(hashes: Hash[]): void {
  //   this.block.uncleHashes = hashes
  // }

  public getHash(): string {
    return '0x' + this.block.hash
  }

  public getNumber(): number {
    return this.block.number
  }

  public getTransactionCount(): number {
    return this.block.transactions.length
  }

  public getTotalBlockReward(): EthValue {

    if (!this.cache.totalBlockReward) {
      let total = 0
      for (let address in this.block.header.rewards) {
        total =  this.block.header.rewards[address] + total
      }
      this.cache.totalBlockReward = total
    }
    return this.cache.totalBlockReward
  }

  public getParentHash(): string {
    if (!this.cache.parentHash) {
      this.cache.parentHash = '0x' + this.block.header.parentHash
    }
    return this.cache.parentHash
  }

  public getNonce(): Hex {
    if (!this.cache.nonce) {
      this.cache.nonce = this.block.header.nonce
    }
    return this.cache.nonce
  }

  // public getMixHash(): Hash {
  //   if (!this.cache.mixHash) {
  //     this.cache.mixHash = common.Hash(this.block.mixHash)
  //   }
  //   return this.cache.mixHash
  // }

  public getSha3Uncles(): string {
    if (!this.cache.sha3Uncles) {
      this.cache.sha3Uncles = '0x' + this.block.header.unclesHash
    }
    return this.cache.sha3Uncles
  }

  public getLogsBloom(): Hex {
    if (!this.cache.logsBloom) {
      this.cache.logsBloom = this.block.header.logsBloom
    }
    return this.cache.logsBloom
  }

  public getStateRoot(): Hash {
    if (!this.cache.stateRoot) {
      this.cache.stateRoot = this.block.header.stateRoot
    }
    return this.cache.stateRoot
  }

  public getMiner(): string {
    if (!this.cache.miner) {
      this.cache.miner = '0x' + this.block.header.miner
    }
    return this.cache.miner
  }

  public getMinerBalance(): EthValue {
    if (!this.cache.minerBalance) {
      this.cache.minerBalance = common.EthValue(this.block.header.rewards[this.block.header.miner])
    }
    return this.cache.minerBalance
  }

  public getDifficulty(): number {
    if (!this.cache.difficulty) {
      this.cache.difficulty = this.block.header.difficulty
    }
    return this.cache.difficulty
  }

  public getTotalDifficulty(): number {
    if (!this.cache.totalDifficulty) {
      this.cache.totalDifficulty = this.block.header.totalDifficulty
    }
    return this.cache.totalDifficulty
  }

  public getExtraData(): Hex {
    if (!this.cache.extraData) {
      this.cache.extraData = common.Hex(this.block.header.extraData)
    }
    return this.cache.extraData
  }

  // public getSize(): HexNumber {
  //   if (!this.cache.size) {
  //     this.cache.size = common.HexNumber(this.block.header.)
  //   }
  //   return this.cache.size
  // }

  public getGasLimit(): number {
    if (!this.cache.gasLimit) {
      this.cache.garLimit = this.block.header.gasLimit
    }
    return this.cache.garLimit
  }

  public getGasUsed(): number {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = this.block.header.gasUsed
    }
    return this.cache.gasUsed
  }

  public getTimestamp(): Date {
    if (!this.cache.timestamp) {
      this.cache.timestamp = this.block.header.timestamp
    }
    return new Date(this.cache.timestamp * 1000)
  }

  public getTransactionsRoot(): Hash {
    if (!this.cache.transactionsRoot) {
      this.cache.transactionsRoot = common.Hash(this.block.header.transactionsRoot)
    }
    return this.cache.transactionsRoot
  }

  public getReceiptsRoot(): Hash {
    if (!this.cache.receiptsRoot) {
      this.cache.receiptsRoot = common.Hash(this.block.header.receiptsRoot)
    }
    return this.cache.receiptsRoot
  }

  public getTransactions(): Tx[] {
    return []
  }

  public geTransactionHashes(): string[] {
    if (!this.cache.transactions) {
      this.cache.transactions = this.block.transactions
    }
    return this.cache.transactions
  }

  public getTxFees(): number {
    if (!this.cache.txFees) {
      this.cache.txFees = this.block.stats.totalTxsFees
    }
    return this.cache.txFees
  }

  public getBlockReward(): number {
    const rewards = this.block.header.rewards
    if (!this.cache.blockReward) {
      this.cache.blockReward = rewards[this.block.header.miner]
    }
    return this.cache.blockReward
  }

  public getUncleReward(): number {
    if (!this.cache.uncleReward) {
      let total = 0
      if (this.block.header.rewards[this.block.header.unclesHash]) {
        return this.cache.uncleReward =  total
      }
        for (let address in this.block.header.rewards) {
          if(address === this.block.header.miner) continue
          total =  this.block.header.rewards[address] + total
        }
        this.cache.uncleReward =  total
      }
    return this.cache.uncleReward
  }

  public getStats(): BlockStats {
    return this.block.stats
  }
}
