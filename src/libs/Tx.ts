import { txLayout } from '@/typeLayouts'
import { common } from '@/libs'
import { Hash, Address, HexNumber, Hex, EthValue, HexTime } from '@/libs/common'

class Tx {
  private readonly tx: txLayout
  public readonly id: string
  private cache: any

  constructor(tx: txLayout) {
    this.cache = {}
    this.tx = tx
    this.id = common.Hash(this.tx.hash).toString()
  }
  getId(): string {
    return this.id
  }
  getHash(): Hash {
    if (!this.cache.hash) this.cache.hash = common.Hash(this.tx.hash)
    return this.cache.hash
  }
  getTo(): Address {
    if (!this.cache.to) this.cache.to = common.Address(this.tx.to)
    return this.cache.to
  }
  getFrom(): Address {
    if (!this.cache.from) this.cache.from = common.Address(this.tx.from)
    return this.cache.from
  }
  getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) this.cache.gasUsed = common.HexNumber(this.tx.gasUsed)
    return this.cache.gasUsed
  }
  getBlockHash(): Hash {
    if (!this.cache.blcokHash) this.cache.blcokHash = common.Hash(this.tx.blockHash)
    return this.cache.blcokHash
  }
  getBlockNumber(): HexNumber {
    if (!this.cache.blockNumber) this.cache.blockNumber = common.HexNumber(this.tx.blockNumber)
    return this.cache.blockNumber
  }
  geTransactionIndex(): HexNumber {
    if (!this.cache.transactionIndex) this.cache.transactionIndex = common.HexNumber(this.tx.transactionIndex)
    return this.cache.transactionIndex
  }
  getFromBalance(): EthValue {
    if (!this.cache.fromBalance) this.cache.fromBalance = common.EthValue(this.tx.fromBalance)
    return this.cache.fromBalance
  }
  getToBalance(): EthValue {
    if (!this.cache.ethValue) this.cache.ethValue = common.EthValue(this.tx.toBalance)
    return this.cache.ethValue
  }

  getCumulativeGasUsed(): HexNumber {
    if (!this.cache.cumulativeGasUsed) this.cache.cumulativeGasUsed = common.HexNumber(this.tx.cumulativeGasUsed)
    return this.cache.cumulativeGasUsed
  }
  getContractAddress(): Address {
    if (!this.cache.contractAddress) this.cache.contractAddress = common.Address(this.tx.contractAddress)
    return this.cache.contractAddress
  }
  getLogsBloom(): Hex {
    if (!this.cache.logsBloom) this.cache.logsBloom = common.Hex(this.tx.logsBloom)
    return this.cache.logsBloom
  }
  getGas(): HexNumber {
    if (!this.cache.gas) this.cache.gas = common.HexNumber(this.tx.gas)
    return this.cache.gas
  }
  getGasPrice(): EthValue {
    if (!this.cache.gasPrice) this.cache.gasPrice = common.EthValue(this.tx.gasPrice)
    return this.cache.gasPrice
  }

  getInput(): Hex {
    if (!this.cache.input) this.cache.input = common.Hex(this.tx.input)
    return this.cache.input
  }
  getNonce(): HexNumber {
    if (!this.cache.hexNumber) this.cache.hexNumber = common.HexNumber(this.tx.nonce)
    return this.cache.hexNumber
  }
  getValue(): EthValue {
    if (!this.cache.ethValue) this.cache.ethValue = common.EthValue(this.tx.value)
    return this.cache.ethValue
  }
  getV(): Hex {
    if (!this.cache.v) this.cache.v = common.Hex(this.tx.v)
    return this.cache.v
  }
  getR(): Hex {
    if (!this.cache.r) this.cache.r = common.Hex(this.tx.r)
    return this.cache.r
  }
  getS(): Hex {
    if (!this.cache.s) this.cache.s = common.Hex(this.tx.s)
    return this.cache.s
  }
  getStatus(): boolean {
    return this.tx.status
  }
  isPending(): boolean {
    return this.tx.pending
  }
  getTimestamp(): HexTime {
    if (!this.cache.timestamp) this.cache.timestamp = common.HexTime(this.tx.timestamp)
    return this.cache.timestamp
  }
}

export default Tx
