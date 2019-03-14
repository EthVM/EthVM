import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { ActionEmbedded } from '@app/orm/embedded-entities/block/action.embedded'
import { ResultEmbedded } from '@app/orm/embedded-entities/block/result.embedded'

export class TraceEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'string', readonly: true })
  blockHash: string

  @Column({ type: 'long', readonly: true })
  blockNumber: number

  @Column({ type: 'string', readonly: true })
  error: string

  @Column({ type: 'int', readonly: true })
  subtraces: number

  @Column({ type: 'array', readonly: true })
  traceAddress: number[]

  @Column({ type: 'string', readonly: true })
  transactionHash: string

  @Column({ type: 'int', readonly: true })
  transactionPosition: number

  @Column({ type: 'string', readonly: true })
  type: string

  // TODO fix error "Cannot read property 'TraceCallActionRecord' of undefined" when using TransactionRepository
  // @Column(type => ActionEmbedded)
  // action: ActionEmbedded

  @Column(type => ResultEmbedded)
  result: ResultEmbedded
}
