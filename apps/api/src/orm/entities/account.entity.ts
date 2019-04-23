import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_account')
export class AccountEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'numeric', readonly: true})
  balance!: string

  @Column({type: 'bigint', readonly: true})
  totalTxCount?: string

  @Column({type: 'bigint', readonly: true})
  inTxCount?: string

  @Column({type: 'bigint', readonly: true})
  outTxCount?: string

  @Column({type: 'boolean', readonly: true})
  isMiner!: boolean

  @Column({type: 'boolean', readonly: true})
  isContractCreator!: boolean

}
