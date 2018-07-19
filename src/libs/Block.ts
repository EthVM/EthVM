import { common, Tx } from '@/libs'
import { Address, EthValue, Hash, Hex, HexNumber, HexTime } from '@/libs/common'
import { blockLayout } from '@/typeLayouts'
import bn from 'bignumber.js'

class Block {
  public readonly id: string
  private readonly block: blockLayout
  private cache: any
  constructor(block: blockLayout) {
    this.cache = {}
    this.block = block
    this.id = common.Hash(this.block.hash).toString()
  }
  public getId(): string {
    return this.id
  }
  public setTransactions(txs: Tx[]): void {
    this.block.transactions = txs
  }
  public setIsUncle(isUncle: boolean): void {
    if (isUncle) {
      this.setTransactions([])
      this.setUncles([])
      this.setUncleHashes([])
    }
    this.block.isUncle = isUncle
  }
  public setUncles(uncles: Block[]): void {
    this.block.uncles = uncles
  }
  public addUncle(uncle: Block): void {
    if (!this.block.uncles) { this.block.uncles = [] }
    this.block.uncles.push(uncle)
  }
  public getIsUncle(): boolean {
    if (!this.cache.isUncle) { this.cache.isUncle = this.block.isUncle }
    return this.cache.isUncle
  }
  public getUncles(): Block[] {
    return this.block.uncles
  }
  public getUncleHashes(): Hash[] {
    return this.block.uncleHashes.map(_uncle => {
      return common.Hash(_uncle)
    })
  }
  public setUncleHashes(hashes: Hash[]): void {
    this.block.uncleHashes = hashes
  }
  public getHash(): Hash {
    if (!this.cache.hash) { this.cache.hash = common.Hash(this.block.hash) }
    return this.cache.hash
  }
  public getIntNumber(): number {
    return this.block.intNumber
  }
  public getNumber(): HexNumber {
    if (!this.cache.number) { this.cache.number = common.HexNumber(this.block.number) }
    return this.cache.number
  }
  public getTransactionCount(): number {
    return typeof this.block.transactionCount !== 'undefined' ? this.block.transactionCount : this.block.transactionHashes.length
  }
  public getTotalBlockReward(): EthValue {
    if (!this.cache.totalBlockReward) {
      this.cache.totalBlockReward = this.block.totalBlockReward
        ? common.EthValue(this.block.totalBlockReward)
        : common.EthValue(
            Buffer.from(
              new bn(common.HexNumber(this.block.blockReward).toString())
                .plus(new bn(common.HexNumber(this.block.uncleReward).toString()))
                .plus(new bn(common.HexNumber(this.block.txFees).toString()))
                .toString(16),
              'hex'
            )
          )
    }

    return this.cache.totalBlockReward
  }
  public getParentHash(): Hash {
    if (!this.cache.parentHash) { this.cache.parentHash = common.Hash(this.block.parentHash) }
    return this.cache.parentHash
  }
  public getNonce(): Hex {
    if (!this.cache.nonce) { this.cache.nonce = common.Hex(this.block.nonce) }
    return this.cache.nonce
  }
  public getMixHash(): Hash {
    if (!this.cache.mixHash) { this.cache.mixHash = common.Hash(this.block.mixHash) }
    return this.cache.mixHash
  }
  public getSha3Uncles(): Hash {
    if (!this.cache.sha3Uncles) { this.cache.sha3Uncles = common.Hash(this.block.sha3Uncles) }
    return this.cache.sha3Uncles
  }
  public getLogsBloom(): Hex {
    if (!this.cache.logsBloom) { this.cache.logsBloom = common.Hex(this.block.logsBloom) }
    return this.cache.logsBloom
  }

  public getStateRoot(): Hash {
    if (!this.cache.stateRoot) { this.cache.stateRoot = common.Hash(this.block.stateRoot) }
    return this.cache.stateRoot
  }
  public getMiner(): Address {
    if (!this.cache.miner) { this.cache.miner = common.Address(this.block.miner) }
    return this.cache.miner
  }
  public getMinerBalance(): EthValue {
    if (!this.cache.minerBalance) { this.cache.minerBalance = common.EthValue(this.block.minerBalance) }
    return this.cache.minerBalance
  }
  public getDifficulty(): HexNumber {
    if (!this.cache.difficulty) { this.cache.difficulty = common.HexNumber(this.block.difficulty) }
    return this.cache.difficulty
  }

  public getTotalDifficulty(): HexNumber {
    if (!this.cache.totalDifficulty) { this.cache.totalDifficulty = common.HexNumber(this.block.totalDifficulty) }
    return this.cache.totalDifficulty
  }
  public getExtraData(): Hex {
    if (!this.cache.extraData) { this.cache.extraData = common.Hex(this.block.extraData) }
    return this.cache.extraData
  }
  public getSize(): HexNumber {
    if (!this.cache.size) { this.cache.size = common.HexNumber(this.block.size) }
    return this.cache.size
  }
  public getGasLimit(): HexNumber {
    if (!this.cache.gasLimit) { this.cache.garLimit = common.HexNumber(this.block.gasLimit) }
    return this.cache.garLimit
  }
  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) { this.cache.gasUsed = common.HexNumber(this.block.gasUsed) }
    return this.cache.gasUsed
  }
  public getTimestamp(): HexTime {
    if (!this.cache.timestamp) { this.cache.timestamp = common.HexTime(this.block.timestamp) }
    return this.cache.timestamp
  }
  public getTransactionsRoot(): Hash {
    if (!this.cache.transactionsRoot) { this.cache.transactionsRoot = common.Hash(this.block.transactionsRoot) }
    return this.cache.transactionsRoot
  }
  public getReceiptsRoot(): Hash {
    if (!this.cache.receiptsRoot) { this.cache.receiptsRoot = common.Hash(this.block.receiptsRoot) }
    return this.cache.receiptsRoot
  }
  public getTransactions(): Tx[] {
    return this.block.transactions
  }
  public geTransactionHashes(): Hash[] {
    if (!this.cache.transactionHashes) {
      this.cache.transactionHashes = this.block.transactionHashes.map((_hash, idx) => {
        return common.Hash(_hash)
      })
    }
    return this.cache.transactionHashes
  }
  public getTxFees(): EthValue {
    if (!this.cache.txFees) { this.cache.txFees = common.EthValue(this.block.txFees) }
    return this.cache.txFees
  }
  public getBlockReward(): EthValue {
    if (!this.cache.blockReward) { this.cache.blockReward = common.EthValue(this.block.blockReward) }
    return this.cache.blockReward
  }
  public getUncleReward(): EthValue {
    if (!this.cache.uncleReward) { this.cache.uncleReward = common.EthValue(this.block.uncleReward) }
    return this.cache.uncleReward
  }
  public getStats(): blockLayout['blockStats'] {
    return this.block.blockStats
  }
}

export default Block
