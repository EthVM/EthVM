import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class DestructedEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  address: string

  @Column({type: 'binary', readonly: true})
  balance: Buffer

  @Column({type: 'binary', readonly: true})
  refundAddress: Buffer

}
