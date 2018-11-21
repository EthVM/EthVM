import { common } from '@app/helpers'
import { EthValue, Hex, HexNumber } from '@app/models'
import { PendingTx as PendingTxLayout } from 'ethvm-common'

export class PendingTx {
  public readonly id: string
  private readonly pTx: PendingTxLayout
  private cache: any

  constructor(pTx: PendingTxLayout) {
    this.cache = {}
    this.pTx = pTx
  }

  public getID(): string {
    return this.pTx.hash
  }

  public getHash(): string {
    if (!this.cache.to) {
      this.cache.to = '' // TODO get from mongo
    }
    return this.cache.to
  }

  public getTo(): string {
    if (!this.cache.to) {
      this.cache.to = this.pTx.to
    }
    return this.cache.to
  }

  public getFrom(): string {
    if (!this.cache.from) {
      this.cache.from = this.pTx.from
    }
    return this.cache.from
  }

  public getGasPrice(): number {
    if (!this.cache.gasPrice) {
      this.cache.gasPrice = this.pTx.gasPrice
    }
    return this.cache.gasPrice
  }

  public getGasLimit(): number {
    if (!this.cache.gasLimit) {
      this.cache.gasLimit = this.pTx.gasLimit
    }
    return this.cache.gasLimit
  }

  public getContractAddress(): string {
    if (!this.cache.contractAddress) {
      this.cache.contractAddress = this.pTx.contractAddress
    }
    return this.cache.contractAddress
  }

  public getNonce(): string {
    if (!this.cache.nonce) {
      this.cache.nonce = this.pTx.nonce
    }
    return this.cache.hexNumber
  }

  public getValue(): EthValue {
    if (!this.cache.ethValue) {
      this.cache.ethValue = common.EthValue(this.pTx.value)
    }
    return this.cache.ethValue
  }

  public getV(): number {
    if (!this.cache.v) {
      this.cache.v = this.pTx.v
    }
    return this.cache.v
  }

  public getR(): number {
    if (!this.cache.r) {
      this.cache.r = this.pTx.r
    }
    return this.cache.r
  }

  public getS(): number {
    if (!this.cache.s) {
      this.cache.s = this.pTx.s
    }
    return this.cache.s
  }
}
