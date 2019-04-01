import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class SupportEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'string', readonly: true })
  email: string

  @Column({ type: 'string', readonly: true })
  url: string
}
