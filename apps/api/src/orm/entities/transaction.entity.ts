import {Column, Entity, PrimaryColumn, OneToOne, JoinColumn} from 'typeorm'
import {assignClean} from '@app/shared/utils'
import BigNumber from 'bignumber.js'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import {DateTransformer} from '@app/orm/transformers/date.transformer'
import {BufferTransformer} from '@app/orm/transformers/buffer.transformer'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity';
import {TraceEntity} from '@app/orm/entities/trace.entity';

@Entity('transaction')
export class TransactionEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'char', length: 66, readonly: true })
  hash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  nonce!: BigNumber

  @Column({ type: 'char', length: 66, readonly: true })
  blockHash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'int', readonly: true })
  transactionIndex!: number

  @Column({ type: 'char', length: 42, readonly: true })
  from!: string

  @Column({ type: 'char', length: 42, readonly: true })
  to?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  value!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  gasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  gas!: BigNumber

  @Column({ type: 'bytea', readonly: true, transformer: new BufferTransformer() })
  input?: Buffer

  @Column({ type: 'bigint', readonly: true })
  v!: string

  @Column({ type: 'char', length: 78, readonly: true })
  r!: string

  @Column({ type: 'char', length: 78, readonly: true })
  s!: string

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({ type: 'char', length: 42, readonly: true })
  creates?: string

  @Column({ type: 'bigint', readonly: true })
  chainId?: string

  @OneToOne(type => TransactionReceiptEntity, receipt => receipt.tx)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'transactionHash',
  })
  receipt?: TransactionReceiptEntity

  @OneToOne(type => TraceEntity, trace => trace.tx)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'transactionHash',
  })
  trace?: TraceEntity

}
