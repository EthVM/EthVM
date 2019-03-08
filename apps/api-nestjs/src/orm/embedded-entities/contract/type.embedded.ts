import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class TypeEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string'})
  string: string

}
