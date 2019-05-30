import { assignClean } from '@app/shared/utils'
import { BigNumber } from 'bignumber.js'
import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BigNumberTransformer } from '../transformers/big-number.transformer'

@Entity('canonical_account')
export class AccountEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  balance!: BigNumber

  @Column({ type: 'bigint', nullable: true, readonly: true, transformer: new BigNumberTransformer() })
  totalTxCount?: BigNumber

  @Column({ type: 'bigint', nullable: true, readonly: true, transformer: new BigNumberTransformer() })
  inTxCount?: BigNumber

  @Column({ type: 'bigint', nullable: true, readonly: true, transformer: new BigNumberTransformer() })
  outTxCount?: BigNumber

  @Column({ type: 'boolean', readonly: true })
  isContract!: boolean

}
