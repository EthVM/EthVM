import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class ResultEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  address: string

  @Column({type: 'string', readonly: true})
  code: string

  @Column({type: 'string', readonly: true})
  gasUsed: string

  @Column({type: 'string', readonly: true})
  output: string

}
