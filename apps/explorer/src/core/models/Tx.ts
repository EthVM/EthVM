import { EthValue, Hex, HexNumber, TxReceipt } from '@app/core/models'
import { Tx as RawTx } from 'ethvm-common'

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
    return this.id
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

  public getGas(): HexNumber {
    if (!this.cache.gas) {
      this.cache.gas = new HexNumber(this.tx.gas)
    }
    return this.cache.gas
  }

  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = new HexNumber(this.tx.receipt.gasUsed)
    }
    return this.cache.gasUsed
  }

  public getGasPrice(): EthValue {
    if (!this.cache.gasPrice) {
      this.cache.gasPrice = new EthValue(this.tx.gasPrice)
    }
    return this.cache.gasPrice
  }

  public getBlockHash(): Hex {
    if (!this.cache.blockHash) {
      this.cache.blockHash = new Hex(this.tx.blockHash)
    }
    return this.cache.blockHash
  }

  public getBlockNumber(): number {
    return Number(this.tx.blockNumber)
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

  public getTxCost(): EthValue {
    return new EthValue(this.getGasPrice().toWei() * this.getGasUsed().toNumber())
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
      this.cache.status = true
    }
    return this.cache.status
  }

  public getReceipt(): TxReceipt {
    if (!this.cache.txReceipt) {
      this.cache.txReceipt = new TxReceipt(this.tx.receipt)
    }
    return this.cache.txReceipt
  }

  public getTimestamp(): Date {
    return new Date(this.tx.timestamp * 1000)
  }
}
