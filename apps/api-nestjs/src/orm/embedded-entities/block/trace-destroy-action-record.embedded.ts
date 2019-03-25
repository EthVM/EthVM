import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class TraceDestroyActionRecordEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'string', readonly: true })
  address: string

  @Column({ type: 'string', readonly: true })
  balance: string

  @Column({ type: 'string', readonly: true })
  refundAddress: string
}
