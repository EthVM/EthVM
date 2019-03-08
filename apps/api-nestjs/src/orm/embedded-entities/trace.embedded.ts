import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { ActionEmbedded } from '@app/orm/embedded-entities/action.embedded'
import { ResultEmbedded } from '@app/orm/embedded-entities/result.embedded'

export class TraceEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  blockHash: string

  @Column({type: 'long', readonly: true})
  blockNumber: number

  @Column({type: 'string', readonly: true})
  error: string

  @Column({type: 'int', readonly: true})
  subtraces: number

  @Column({type: 'array', readonly: true})
  traceAddress: number[]

  @Column({type: 'string', readonly: true})
  transactionHash: string

  @Column({type: 'int', readonly: true})
  transactionPosition: number

  @Column({type: 'string', readonly: true})
  type: string

  @Column(type => ActionEmbedded)
  action: ActionEmbedded

  @Column(type => ResultEmbedded)
  result: ResultEmbedded

}
