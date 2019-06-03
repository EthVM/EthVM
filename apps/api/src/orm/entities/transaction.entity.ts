import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from 'typeorm'
import {assignClean} from '@app/shared/utils'
import {BlockHeaderEntity} from '@app/orm/entities/block-header.entity'
import {TransactionReceiptEntity} from '@app/orm/entities/transaction-receipt.entity'
import {TransactionTraceEntity} from '@app/orm/entities/transaction-trace.entity'
import BigNumber from 'bignumber.js'
import {BigNumberTransformer} from '@app/orm/transformers/big-number.transformer'
import {ContractEntity} from '@app/orm/entities/contract.entity'

@Entity('canonical_transaction')
export class TransactionEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'character', length: 66, readonly: true })
  hash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  nonce!: BigNumber

  @Column({ type: 'character', length: 66, readonly: true })
  blockHash!: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  blockNumber!: BigNumber

  @Column({ type: 'integer', readonly: true })
  transactionIndex!: number

  @Column({ type: 'character', length: 66, readonly: true })
  from!: string

  @Column({ type: 'character', length: 66, readonly: true })
  to?: string

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  value!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  gasPrice!: BigNumber

  @Column({ type: 'numeric', readonly: true, transformer: new BigNumberTransformer() })
  gas!: BigNumber

  @Column({ type: 'bytea', readonly: true })
  input?: Buffer

  @Column({ type: 'bigint', readonly: true })
  v!: string

  @Column({ type: 'character', length: 78, readonly: true })
  r!: string

  @Column({ type: 'character', length: 78, readonly: true })
  s!: string

  @Column({ type: 'timestamp', readonly: true })
  timestamp!: Date

  @Column({ type: 'character', length: 66, readonly: true })
  creates?: string

  @Column({ type: 'bigint', readonly: true })
  chainId?: string

  @ManyToOne(type => BlockHeaderEntity, block => block.txs)
  @JoinColumn({
    name: 'blockHash',
    referencedColumnName: 'hash',
  })
  blockHeader!: BlockHeaderEntity

  @OneToOne(type => TransactionReceiptEntity, receipt => receipt.tx)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'transactionHash',
  })
  receipt?: TransactionReceiptEntity

  @OneToOne(type => TransactionTraceEntity, trace => trace.tx)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'transactionHash',
  })
  trace?: TransactionTraceEntity

  @OneToMany(type => ContractEntity, contract => contract.createdAtTx)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'traceCreatedAtTransactionHash',
  })
  contracts?: ContractEntity[]

}
