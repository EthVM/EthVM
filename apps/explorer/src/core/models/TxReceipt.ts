import { Hex, HexNumber } from '@app/core/models'
import { TxReceipt as RawTxReceipt } from 'ethvm-common'

export class TxReceipt {
  public readonly id: string
  private cache: any = {}

  constructor(private readonly receipt: RawTxReceipt) {
    this.id = new Hex(this.receipt.transactionHash).toString()
  }

  public getId(): string {
    return this.id
  }

  public getBlockHash(): Hex {
    return new Hex(this.receipt.blockHash)
  }

  public getTransactionIndex(): number {
    return this.receipt.transactionIndex
  }

  public getCumulativeGasUsed(): HexNumber {
    if (!this.cache.cumulativeGasUsed) {
      this.cache.cumulativeGasUsed = new HexNumber(this.receipt.cumulativeGasUsed)
    }
    return this.cache.cumulativeGasUsed
  }

  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = new HexNumber(this.receipt.gasUsed)
    }
    return this.cache.gasUsed
  }

  public getLogsBloom(): Hex {
    if (!this.cache.logsBloom) {
      this.cache.logsBloom = new Hex(this.receipt.logsBloom)
    }
    return this.cache.logsBloom
  }

  public getContractAddress(): Hex {
    if (!this.cache.contractAddress) {
      this.cache.contractAddress = new Hex(this.receipt.contractAddress || '')
    }
    return this.cache.contractAddress
  }

  public getStatus(): string {
    return this.receipt.status
  }

  public hasError(): boolean {
    return this.receipt.error !== '' || this.receipt.error != undefined || this.receipt.error != null
  }
}
