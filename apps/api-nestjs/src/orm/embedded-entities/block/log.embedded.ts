import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class LogEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  address: string

  @Column({type: 'string', readonly: true})
  data: string

  @Column({type: 'array', readonly: true})
  topics: string[]

}
