import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class LogoEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  src: string

}
