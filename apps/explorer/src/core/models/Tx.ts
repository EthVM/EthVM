import { EthValue } from '@app/core/models'
import { Tx as RawTx } from 'ethvm-common'

export class Tx {
  public readonly id: string
  private cache: any = {}

  constructor(private readonly tx: RawTx) {
    this.id = this.tx.hash.startsWith('0x') ? this.tx.hash : '0x' + this.tx.hash
  }

  public getId(): string {
    return this.id
  }

  public getHash(): string {
    return '0x' + this.tx.hash
  }

  public getTo(): string {
    return this.tx.to ? '0x' + this.tx.to : ''
  }

  public getFrom(): string {
    return '0x' + this.tx.from
  }

  // TODO: Optimize Decimal128
  public getGasUsed(): number {
    return 0
  }

  public getBlockHash(): string {
    return '0x' + this.tx.blockHash
  }

  public getBlockNumber(): number {
    return this.tx.blockNumber
  }

  public geTransactionIndex(): number {
    return this.tx.transactionIndex
  }

  public getContractAddress(): string {
    return this.tx.contractAddress ? '0x' + this.tx.contractAddress : ''
  }

  public getGas(): number {
    if (!this.cache.gas) {
      this.cache.gas = this.tx.gasUsed
    }
    return this.cache.gas
  }

  public getGasPrice(): number {
    if (!this.cache.gasPrice) {
      this.cache.gasPrice = this.tx.gasPrice
    }
    return this.cache.gasPrice
  }

  public getNonce(): string {
    return this.tx.nonce
  }

  public getValue(): EthValue {
    if (!this.cache.ethValue) {
      this.cache.ethValue = new EthValue(this.tx.value)
    }
    return this.cache.ethValue
  }

  public getV(): number {
    if (!this.cache.v) {
      this.cache.v = this.tx.v
    }
    return this.cache.v
  }

  public getR(): number {
    if (!this.cache.r) {
      this.cache.r = this.tx.r
    }
    return this.cache.r
  }

  public getS(): number {
    if (!this.cache.s) {
      this.cache.s = this.tx.s
    }
    return this.cache.s
  }

  public getStatus(): boolean {
    return this.tx.status
  }

  public getTimestamp(): Date {
    return new Date(this.tx.timestamp * 1000)
  }
}
