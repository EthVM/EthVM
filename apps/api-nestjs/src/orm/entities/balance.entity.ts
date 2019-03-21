import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export enum BalanceType {
  TX_FEE,
  REWARD,
  ETHER,
  ERC20,
  ERC721,
}

interface BalanceKeyInterface {
  balanceType: BalanceType
  address: string
}

@Entity('balances')
export class BalanceEntity {
  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({ name: '_id', readonly: true })
  id: BalanceKeyInterface

  @Column({ type: 'string', readonly: true })
  address: string

  @Column({ type: 'string', readonly: true })
  amount: string

  @Column({ type: 'enum', enum: BalanceType, readonly: true })
  balanceType: BalanceType
}
