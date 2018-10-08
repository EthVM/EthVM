import { common } from '@app/helpers'
import { Address, EthValue, Hash, Hex, HexNumber, HexTime } from '@app/models'
import { TxLayout } from '@app/models/server'

export class Tx {
  public readonly id: string
  private readonly tx: TxLayout
  private cache: any

  constructor(tx: TxLayout) {
    this.cache = {}
    this.tx = tx
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

  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = common.HexNumber(this.tx.gasUsed)
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
      this.cache.transactionIndex = this.tx.transactionIndex
    }
    return this.cache.transactionIndex
  }

  // public getFromBalance(): EthValue {
  //   if (!this.cache.fromBalance) {
  //     this.cache.fromBalance = common.EthValue(this.tx.fromBalance)
  //   }
  //   return this.cache.fromBalance
  // }

  // public getToBalance(): EthValue {
  //   if (!this.cache.ethValue) {
  //     this.cache.ethValue = common.EthValue(this.tx.toBalance)
  //   }
  //   return this.cache.ethValue
  // }

  // public getCumulativeGasUsed(): HexNumber {
  //   if (!this.cache.cumulativeGasUsed) {
  //     this.cache.cumulativeGasUsed = common.HexNumber(this.tx.cumulativeGasUsed)
  //   }
  //   return this.cache.cumulativeGasUsed
  // }

  public getContractAddress(): string {
    if (!this.cache.contractAddress) {
      if(this.tx.contractAddress){
        this.cache.contractAddress = '0x' + this.tx.contractAddress
      }
    }
    return this.cache.contractAddress
  }

  // public getLogsBloom(): Hex {
  //   if (!this.cache.logsBloom) {
  //     this.cache.logsBloom = common.Hex(this.tx.logsBloom)
  //   }
  //   return this.cache.logsBloom
  // }

  public getGas(): HexNumber {
    if (!this.cache.gas) {
      this.cache.gas = common.HexNumber(this.tx.gasUsed)
    }
    return this.cache.gas
  }

  public getGasPrice(): EthValue {
    if (!this.cache.gasPrice) {
      this.cache.gasPrice = common.EthValue(this.tx.gasPrice)
    }
    return this.cache.gasPrice
  }

  // public getInput(): Hex {
  //   if (!this.cache.input) {
  //     this.cache.input = common.Hex(this.tx.input)
  //   }
  //   return this.cache.input
  // }

  public getNonce(): HexNumber {
    if (!this.cache.hexNumber) {
      this.cache.hexNumber = common.HexNumber(this.tx.nonce)
    }
    return this.cache.hexNumber
  }

  public getValue(): EthValue {
    if (!this.cache.ethValue) {
      this.cache.ethValue = common.EthValue(this.tx.value)
    }
    return this.cache.ethValue
  }

  public getV(): number {
    if (!this.cache.v) {
      this.cache.v = this.tx.v
    }
    return this.cache.v
  }

  public getR(): Hex {
    if (!this.cache.r) {
      this.cache.r = common.Hex(this.tx.r)
    }
    return this.cache.r
  }

  public getS(): Hex {
    if (!this.cache.s) {
      this.cache.s = common.Hex(this.tx.s)
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
