import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

interface TokenTransferKeyInterface {
  hash: string
}
export enum BalanceType {
  TX_FEE,
  REWARD,
  ETHER,
  ERC20,
  ERC721,
}


@Entity('token_transfers')
export class TokenTransferEntity {
  constructor(data: any) {
    assignClean(this, data)
  }

  @ObjectIdColumn({ name: '_id', readonly: true })
  id!: TokenTransferKeyInterface

  @Column({ type: 'string', readonly: true })
  amount!: string

  @Column({ type: 'string', readonly: true })
  contract!: string

  @Column({ type: 'string', readonly: true })
  from!: string

  @Column({ type: 'long', readonly: true })
  timestamp!: number

  @Column({ type: 'string', readonly: true })
  to!: string

  @Column({ type: 'string', readonly: true })
  tokenId!: string

  @Column({ type: 'enum', enum: BalanceType, default: BalanceType.ETHER, readonly: true })
  transferType!: BalanceType
}
