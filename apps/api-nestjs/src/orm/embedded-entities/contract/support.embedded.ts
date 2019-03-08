import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class SupportEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string'})
  email: string

  @Column({type: 'string'})
  url: string

}
