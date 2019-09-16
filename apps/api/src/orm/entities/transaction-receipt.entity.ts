import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '../transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import {DateTransformer} from '@app/orm/transformers/date.transformer'
import {TransactionEntity} from '@app/orm/entities/transaction.entity'

@Entity('transaction_receipt')
export class TransactionReceiptEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'char', length: 66, readonly: true })
  transactionHash!: string

  @Column({ type: 'int', readonly: true })
  transactionIndex!: number

  @Column({ type: 'char', length: 66, readonly: true })
  blockHash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: string

  @Column({ type: 'char', length: 42, readonly: true })
  from!: string

  @Column({ type: 'char', length: 42, readonly: true })
  to?: string

  @Column({ type: 'char', length: 42, readonly: true })
  contractAddress?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  cumulativeGasUsed!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  gasUsed!: BigNumber

  @Column({ type: 'text', readonly: true })
  logs!: string

  @Column({ type: 'char', length: 514, readonly: true })
  logsBloom!: string

  @Column({ type: 'char', length: 66, readonly: true })
  root?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  status?: BigNumber

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @OneToOne(type => TransactionEntity, tx => tx.receipt)
  @JoinColumn({
    name: 'transactionHash',
    referencedColumnName: 'hash',
  })
  tx!: TransactionEntity

}
