import { LogRecord } from './log-record'
import { InternalTransactionRecord } from './internal-tx-record'

export class TxReceiptRecord {

  blockHash: Buffer
  blockNumber: Buffer
  transactionHash: Buffer
  transactionIndex: number
  contractAddress?: Buffer
  cumulativeGasUsed: Buffer
  gasUsed: Buffer
  logs: LogRecord[]
  logsBloom: Buffer
  root: Buffer
  status: Buffer
  error: String
  internalTxs: InternalTransactionRecord[]
  deletedAccounts: Buffer[]

  constructor(props) {
    Object.assign(this, props)

    this.internalTxs = props.internalTxs.map(raw => new InternalTransactionRecord(raw)) || []
    this.logs = props.logs.map(raw => new LogRecord(raw)) || []
  }
}
