import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('balances')
export class BalanceEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({name: '_id', type: 'decimal', readonly: true})
  number: ObjectID

  @Column({type: 'string'})
  address: string

  @Column({type: 'string'})
  amount: string

  @Column({type: 'string'})
  balanceType: string

}
