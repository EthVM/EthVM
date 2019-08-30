import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import {BigNumber} from 'bignumber.js'

@Entity('address_transaction_count_delta')
export class AddressTransactionCountDeltaEntity {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'bigint', readonly: true })
  id!: string

  @Column({ type: 'char', length: 42, readonly: true })
  address!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalDelta!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalOutDelta!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalInDelta!: BigNumber

}
