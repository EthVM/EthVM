import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class TraceRewardActionRecordEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'string', readonly: true })
  author: string

  @Column({ type: 'string', readonly: true })
  value: string

  @Column({ type: 'string', readonly: true })
  rewardType: string
}
