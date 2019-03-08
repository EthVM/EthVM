import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class DestructedEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string'})
  address: string

  @Column({type: 'binary'})
  balance: Buffer

  @Column({type: 'binary'})
  refundAddress: Buffer

}
