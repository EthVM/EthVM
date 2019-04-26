import { EthValue, Hex, HexNumber, TxReceipt } from '@app/core/models'

export class SimpleTx {
  public readonly id: string
  private cache: any = {}

  constructor(private readonly tx: any) {
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

  public getGasPrice(): EthValue {
    if (!this.cache.gasPrice) {
      this.cache.gasPrice = new EthValue(this.tx.gasPrice)
    }
    return this.cache.gasPrice
  }

  public getBlockNumber(): number {
    return this.tx.blockNumber
  }

  public getBlockHash(): Hex {
    if (!this.cache.blockHash) {
      this.cache.blockHash = new Hex(this.tx.blockHash)
    }
    return this.cache.blockHash
  }

  public getContractAddress(): Hex {
    if (!this.cache.contractAddress) {
      const receipt = this.getReceipt()
      this.cache.contractAddress = receipt.getContractAddress()
    }
    return this.cache.contractAddress
  }

  public getStatus(): boolean {
    if (!this.cache.status) {
      const receipt = this.getReceipt()
      this.cache.status = receipt.getStatus()
    }
    return this.cache.status
  }

  public getGasUsed(): HexNumber {
    if (!this.cache.gasUsed) {
      this.cache.gasUsed = new HexNumber(this.tx.receipt.gasUsed)
    }
    return this.cache.gasUsed
  }

  public getTxCost(): EthValue {
    return new EthValue(this.getGasPrice().toWei() * this.getGasUsed().toNumber())
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
