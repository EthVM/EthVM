import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import {BigNumber} from 'bignumber.js'

@Entity('canonical_count')
export class CanonicalCountEntity {

  public constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'varchar', length: 64, readonly: true })
  entity!: string

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'bigint', readonly: true, transformer: new BigNumberTransformer() })
  count!: BigNumber

}
