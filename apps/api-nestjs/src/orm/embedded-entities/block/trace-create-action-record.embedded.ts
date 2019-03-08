import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class TraceCreateActionRecordEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  from: string

  @Column({type: 'string', readonly: true})
  gas: string

  @Column({type: 'string', readonly: true})
  init: string

  @Column({type: 'string', readonly: true})
  value: string

}
