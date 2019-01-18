import { EthValue, Hex, HexNumber, TxReceipt } from '@app/core/models'
import { Tx as RawTx } from 'ethvm-common'
import BN from 'bignumber.js'

export class Tx {
  public readonly id: string
  private cache: any = {}

  constructor(private readonly tx: RawTx) {
    this.id = new Hex(this.tx.hash).toString()
  }

  public getId(): string {
    return this.id
  }

  public getHash(): string {
    return '0x' + this.tx.hash
  }

  public getFrom(): Hex {
    if (!this.cache.from) {
      this.cache.from = new Hex(this.tx.from)
    }
    return this.cache.from
  }

  public getTo(): Hex {
    if (!this.cache.to) {
      this.cache.to = new Hex(this.tx.to || '')
    }
    return this.cache.to
  }

  public getValue(): EthValue {
    if (!this.cache.ethValue) {
      this.cache.ethValue = new EthValue(this.tx.value)
    }
    return this.cache.ethValue
  }

  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) {
      const receipt = this.getReceipt()
      this.cache.gasUsed = receipt.getGasUsed()
    }
    return this.cache.gasUsed
  }

  public getGasPrice(): HexNumber {
    if (!this.cache.gasPrice) {
      this.cache.gasPrice = new HexNumber(this.tx.gasPrice)
    }
    return this.cache.gasPrice
  }

  public getBlockHash(): Hex {
    if (!this.cache.blockHash) {
      const receipt = this.getReceipt()
      this.cache.blockHash = receipt.getBlockHash()
    }
    return this.cache.blockHash
  }

  public getBlockNumber(): number {
    if (!this.cache.blockNumber) {
      this.cache.blockNumber = new BN(this.tx.blockNumber).toNumber()
    }
    return this.cache.blockNumber
  }

  public geTransactionIndex(): number {
    return this.tx.transactionIndex
  }

  public getContractAddress(): Hex {
    if (!this.cache.contractAddress) {
      const receipt = this.getReceipt()
      this.cache.contractAddress = receipt.getContractAddress()
    }
    return this.cache.contractAddress
  }

  public getGas(): HexNumber {
    if (!this.cache.gas) {
      this.cache.gas = new Hex(this.tx.gas)
    }
    return this.cache.gas
  }

  public getNonce(): Hex {
    if (!this.cache.nonce) {
      this.cache.nonce = new Hex(this.tx.nonce)
    }
    return this.cache.nonce
  }

  public getStatus(): boolean {
    if (!this.cache.status) {
      const receipt = this.getReceipt()
      this.cache.status = receipt.getStatus()
    }
    return this.cache.status
  }

  public getTimestamp(): Date {
    return new Date(this.tx.timestamp * 1000)
  }

  public getReceipt(): TxReceipt {
    if (!this.cache.txReceipt) {
      this.cache.txReceipt = new TxReceipt(this.tx.receipt)
    }
    return this.cache.txReceipt
  }
}
