import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('token_transfers')
export class TokenTransferEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  // TODO Set id correctly
  @ObjectIdColumn({name: '_id', readonly: true})
  id: ObjectID

  @Column({type: 'string'})
  amount: string

  @Column({type: 'string'})
  from: string

  @Column({type: 'string'})
  to: string

  @Column({type: 'string'})
  transferType: string

}
