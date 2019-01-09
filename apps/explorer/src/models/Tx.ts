import { EthValue } from '@app/models'
import { Tx as RawTx } from 'ethvm-common'

export class Tx {
  public readonly id: string
  private cache: any

  constructor(private readonly tx: RawTx) {
    this.cache = {}
    this.id = this.tx.hash
  }

  public getId(): string {
    return this.id
  }

  public getHash(): string {
    return '0x' + this.tx.hash
  }

  public getTo(): string {
    if (!this.cache.to) {
      this.cache.to = '0x' + this.tx.to
    }
    return this.cache.to
  }

  public getFrom(): string {
    if (!this.cache.from) {
      this.cache.from = '0x' + this.tx.from
    }
    return this.cache.from
  }

  public getGasUsed(): number {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = this.tx.gasUsed
    }
    return this.cache.gasUsed
  }

  public getBlockHash(): string {
    if (!this.cache.blcokHash) {
      this.cache.blcokHash = '0x' + this.tx.blockHash
    }
    return this.cache.blcokHash
  }

  public getBlockNumber(): number {
    return this.tx.blockNumber
  }

  public geTransactionIndex(): number {
    if (!this.cache.transactionIndex) {
      this.cache.transactionIndex = this.tx.index
    }
    return this.cache.transactionIndex
  }

  // public getFromBalance(): EthValue {
  //   if (!this.cache.fromBalance) {
  //     this.cache.fromBalance = new EthValue(this.tx.fromBalance)
  //   }
  //   return this.cache.fromBalance
  // }

  // public getToBalance(): EthValue {
  //   if (!this.cache.ethValue) {
  //     this.cache.ethValue = new EthValue(this.tx.toBalance)
  //   }
  //   return this.cache.ethValue
  // }

  // public getCumulativeGasUsed(): HexNumber {
  //   if (!this.cache.cumulativeGasUsed) {
  //     this.cache.cumulativeGasUsed = new HexNumber(this.tx.cumulativeGasUsed)
  //   }
  //   return this.cache.cumulativeGasUsed
  // }

  public getContractAddress(): string {
    if (!this.cache.contractAddress) {
      if (this.tx.contractAddress) {
        this.cache.contractAddress = '0x' + this.tx.contractAddress
      }
    }
    return this.cache.contractAddress
  }

  // public getLogsBloom(): Hex {
  //   if (!this.cache.logsBloom) {
  //     this.cache.logsBloom = new Hex(this.tx.logsBloom)
  //   }
  //   return this.cache.logsBloom
  // }

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

  // public getInput(): Hex {
  //   if (!this.cache.input) {
  //     this.cache.input = new Hex(this.tx.input)
  //   }
  //   return this.cache.input
  // }

  public getNonce(): string {
    if (!this.cache.nonce) {
      this.cache.nonce = this.tx.nonce
    }
    return this.cache.nonce
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

  // public isPending(): boolean {
  //   return this.tx.pending
  // }

  public getTimestamp(): Date {
    if (!this.cache.timestamp) {
      this.cache.timestamp = new Date(this.tx.timestamp * 1000)
    }
    return new Date(this.cache.timestamp * 1000)
  }
}
