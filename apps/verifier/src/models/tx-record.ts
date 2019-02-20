import { UBigIntAsNumber, UBigInt } from './../utils'

export class TxRecord {
  hash: Buffer
  nonce: Buffer
  blockHash: Buffer
  blockNumber?: Buffer

  transactionIndex: number

  from: Buffer
  to?: Buffer

  value: Buffer
  gasPrice: Buffer
  gas: Buffer

  input?: Buffer

  v: Buffer
  r: Buffer
  s: Buffer

  creates?: Buffer
  timestamp: number

  constructor(props) {
    Object.assign(this, props)
  }

  get _nonce(): number {
    return UBigIntAsNumber(this.nonce)
  }

  get _gasPrice(): string {
    return UBigIntAsNumber(this.gasPrice).toString()
  }

  get _gas(): string {
    return UBigIntAsNumber(this.gas).toString()
  }

  get _value(): string {
    return UBigInt(this.value).toString()
  }

  get _v(): string {
    return UBigInt(this.value).toString()
  }

}
