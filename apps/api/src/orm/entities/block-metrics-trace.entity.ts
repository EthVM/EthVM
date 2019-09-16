import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import { BigNumber } from 'bignumber.js'
import { DateTransformer } from '@app/orm/transformers/date.transformer'

@Entity('block_metrics_trace')
export class BlockMetricsTraceEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  number!: BigNumber

  @Column({ type: 'char', length: 66, unique: true, readonly: true })
  hash!: string

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({ type: 'int', readonly: true })
  totalTxs?: number

  @Column({ type: 'int', readonly: true })
  numSuccessfulTxs!: number

  @Column({ type: 'int', readonly: true })
  numFailedTxs!: number

  @Column({ type: 'int', readonly: true })
  numInternalTxs!: number

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  totalTxFees!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  avgTxFees!: BigNumber

}
