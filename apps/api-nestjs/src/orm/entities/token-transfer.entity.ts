import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BalanceType } from '@app/orm/entities/balance.entity'

@Entity('token_transfers')
export class TokenTransferEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  // TODO Set id correctly nested {hash: bytes}
  @ObjectIdColumn({name: '_id', readonly: true})
  id: ObjectID

  @Column({type: 'string'})
  amount: string

  @Column({type: 'string'})
  contract: string

  @Column({type: 'string'})
  from: string

  @Column({type: 'long'})
  timestamp: number

  @Column({type: 'string'})
  to: string

  @Column({type: 'string'})
  tokenId: string

  @Column({type: 'enum', enum: BalanceType, default: BalanceType.ETHER})
  transferType: BalanceType

}
