import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class TraceCallActionRecordEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'string', readonly: true })
  callType: string

  @Column({ type: 'string', readonly: true })
  from: string

  @Column({ type: 'string', readonly: true })
  gas: string

  @Column({ type: 'string', readonly: true })
  input: string

  @Column({ type: 'string', readonly: true })
  to: string

  @Column({ type: 'string', readonly: true })
  value: string
}
