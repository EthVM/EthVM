import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export enum BalanceType {
  TX_FEE, REWARD, ETHER, ERC20, ERC721
}

@Entity('balances')
export class BalanceEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  // TODO set id correctly
  @ObjectIdColumn({name: '_id', type: 'decimal', readonly: true})
  id: ObjectID

  @Column({type: 'string'})
  address: string

  @Column({type: 'string'})
  amount: string

  @Column({type: 'enum', enum: BalanceType})
  balanceType: BalanceType

}
