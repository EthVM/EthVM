import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'

@Entity('uncle_reward')
export class UncleRewardEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'character', length: 42, readonly: true })
  address!: string

  @PrimaryColumn({ type: 'character', length: 66, readonly: true })
  blockHash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  amount!: BigNumber
}
