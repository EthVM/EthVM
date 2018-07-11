import { blockLayout } from '@/typeLayouts'
import { common, Tx } from '@/libs'
import { Hash, EthValue, HexNumber, Address, Hex, HexTime } from '@/libs/common'
import bn from 'bignumber.js'

class Block {
  private readonly block: blockLayout
  public readonly id: string
  private cache: any
  constructor(block: blockLayout) {
    this.cache = {}
    this.block = block
    this.id = common.Hash(this.block.hash).toString()
  }
  getId(): string {
    return this.id
  }
  setTransactions(txs: Array<Tx>): void {
    this.block.transactions = txs
  }
  setIsUncle(isUncle: boolean): void {
    if (isUncle) {
      this.setTransactions([])
      this.setUncles([])
      this.setUncleHashes([])
    }
    this.block.isUncle = isUncle
  }
  setUncles(uncles: Array<Block>): void {
    this.block.uncles = uncles
  }
  addUncle(uncle: Block): void {
    if (!this.block.uncles) this.block.uncles = []
    this.block.uncles.push(uncle)
  }
  getIsUncle(): boolean {
    if (!this.cache.isUncle) this.cache.isUncle = this.block.isUncle
    return this.cache.isUncle
  }
  getUncles(): Array<Block> {
    return this.block.uncles
  }
  getUncleHashes(): Array<Hash> {
    return this.block.uncleHashes.map(_uncle => {
      return common.Hash(_uncle)
    })
  }
  setUncleHashes(hashes: Array<Hash>): void {
    this.block.uncleHashes = hashes
  }
  getHash(): Hash {
    if (!this.cache.hash) this.cache.hash = common.Hash(this.block.hash)
    return this.cache.hash
  }
  getIntNumber(): number {
    return this.block.intNumber
  }
  getNumber(): HexNumber {
    if (!this.cache.number) this.cache.number = common.HexNumber(this.block.number)
    return this.cache.number
  }
  getTransactionCount(): number {
    return typeof this.block.transactionCount !== 'undefined' ? this.block.transactionCount : this.block.transactionHashes.length
  }
  getTotalBlockReward(): EthValue {
    if (!this.cache.totalBlockReward)
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

    return this.cache.totalBlockReward
  }
  getParentHash(): Hash {
    if (!this.cache.parentHash) this.cache.parentHash = common.Hash(this.block.parentHash)
    return this.cache.parentHash
  }
  getNonce(): Hex {
    if (!this.cache.nonce) this.cache.nonce = common.Hex(this.block.nonce)
    return this.cache.nonce
  }
  getMixHash(): Hash {
    if (!this.cache.mixHash) this.cache.mixHash = common.Hash(this.block.mixHash)
    return this.cache.mixHash
  }
  getSha3Uncles(): Hash {
    if (!this.cache.sha3Uncles) this.cache.sha3Uncles = common.Hash(this.block.sha3Uncles)
    return this.cache.sha3Uncles
  }
  getLogsBloom(): Hex {
    if (!this.cache.logsBloom) this.cache.logsBloom = common.Hex(this.block.logsBloom)
    return this.cache.logsBloom
  }

  getStateRoot(): Hash {
    if (!this.cache.stateRoot) this.cache.stateRoot = common.Hash(this.block.stateRoot)
    return this.cache.stateRoot
  }
  getMiner(): Address {
    if (!this.cache.miner) this.cache.miner = common.Address(this.block.miner)
    return this.cache.miner
  }
  getMinerBalance(): EthValue {
    if (!this.cache.minerBalance) this.cache.minerBalance = common.EthValue(this.block.minerBalance)
    return this.cache.minerBalance
  }
  getDifficulty(): HexNumber {
    if (!this.cache.difficulty) this.cache.difficulty = common.HexNumber(this.block.difficulty)
    return this.cache.difficulty
  }

  getTotalDifficulty(): HexNumber {
    if (!this.cache.totalDifficulty) this.cache.totalDifficulty = common.HexNumber(this.block.totalDifficulty)
    return this.cache.totalDifficulty
  }
  getExtraData(): Hex {
    if (!this.cache.extraData) this.cache.extraData = common.Hex(this.block.extraData)
    return this.cache.extraData
  }
  getSize(): HexNumber {
    if (!this.cache.size) this.cache.size = common.HexNumber(this.block.size)
    return this.cache.size
  }
  getGasLimit(): HexNumber {
    if (!this.cache.gasLimit) this.cache.garLimit = common.HexNumber(this.block.gasLimit)
    return this.cache.garLimit
  }
  getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) this.cache.gasUsed = common.HexNumber(this.block.gasUsed)
    return this.cache.gasUsed
  }
  getTimestamp(): HexTime {
    if (!this.cache.timestamp) this.cache.timestamp = common.HexTime(this.block.timestamp)
    return this.cache.timestamp
  }
  getTransactionsRoot(): Hash {
    if (!this.cache.transactionsRoot) this.cache.transactionsRoot = common.Hash(this.block.transactionsRoot)
    return this.cache.transactionsRoot
  }
  getReceiptsRoot(): Hash {
    if (!this.cache.receiptsRoot) this.cache.receiptsRoot = common.Hash(this.block.receiptsRoot)
    return this.cache.receiptsRoot
  }
  getTransactions(): Array<Tx> {
    return this.block.transactions
  }
  geTransactionHashes(): Array<Hash> {
    if (!this.cache.transactionHashes)
      this.cache.transactionHashes = this.block.transactionHashes.map((_hash, idx) => {
        return common.Hash(_hash)
      })
    return this.cache.transactionHashes
  }
  getTxFees(): EthValue {
    if (!this.cache.txFees) this.cache.txFees = common.EthValue(this.block.txFees)
    return this.cache.txFees
  }
  getBlockReward(): EthValue {
    if (!this.cache.blockReward) this.cache.blockReward = common.EthValue(this.block.blockReward)
    return this.cache.blockReward
  }
  getUncleReward(): EthValue {
    if (!this.cache.uncleReward) this.cache.uncleReward = common.EthValue(this.block.uncleReward)
    return this.cache.uncleReward
  }
  getStats(): blockLayout['blockStats'] {
    return this.block.blockStats
  }
}

export default Block
