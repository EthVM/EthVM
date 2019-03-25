import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { LogEmbedded } from '@app/orm/embedded-entities/block/log.embedded'
import { TraceEmbedded } from '@app/orm/embedded-entities/block/trace.embedded'

export class ReceiptEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'string', readonly: true })
  blockHash: string

  @Column({ type: 'long', readonly: true })
  blockNumber: number

  @Column({ type: 'string', readonly: true })
  contractAddress: string

  @Column({ type: 'string', readonly: true })
  cumulativeGasUsed: string

  @Column({ type: 'string', readonly: true })
  gasUsed: string

  @Column({ type: 'string', readonly: true })
  logsBloom: string

  @Column({ type: 'int', readonly: true })
  numInternalTxs: number

  @Column({ type: 'string', readonly: true })
  root: string

  @Column({ type: 'string', readonly: true })
  transactionHash: string

  @Column({ type: 'string', readonly: true })
  transactionIndex: string

  @Column(type => LogEmbedded)
  logs: LogEmbedded[]

  @Column(type => TraceEmbedded)
  traces: TraceEmbedded[]
}
