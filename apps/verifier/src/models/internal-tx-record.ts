export class InternalTransactionRecord {

  nonce: Buffer
  blockHash: Buffer
  blockNumber: Buffer
  parentHash: Buffer
  transactionIndex: number
  internalTransactionIndex: number
  from: Buffer
  to?: Buffer
  value: Buffer
  gasPrice: Buffer
  gas: Buffer
  input: Buffer
  creates: Buffer
  chainId: number
  depth: number
  rejected: boolean
  note: string

  constructor(props) {
    Object.assign(this, props)
  }
}
