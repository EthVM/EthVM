import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn'
import { BigNumberTransformer } from '../transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import {TransactionEntity} from '@app/orm/entities/transaction.entity'

@Entity('trace')
export class TraceEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({ type: 'char', length: 66, readonly: true })
  blockHash!: string

  @PrimaryColumn({ type: 'char', length: 66, readonly: true })
  transactionHash?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'varchar', length: 514, readonly: true })
  rootError?: string

  @Column({ type: 'timestamp', readonly: true, transformer: new BigNumberTransformer() })
  timestamp!: Date

  @Column({ type: 'int', readonly: true })
  traceCount!: number

  @Column({ type: 'text', readonly: true })
  traces!: string

  @OneToOne(type => TransactionEntity, tx => tx.trace)
  @JoinColumn({
    name: 'transactionHash',
    referencedColumnName: 'hash',
  })
  tx!: TransactionEntity

}
