import { Column, Entity, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '../transformers/big-number.transformer';
import BigNumber from 'bignumber.js';
import {TransactionEntity} from '@app/orm/entities/transaction.entity'

@Entity('canonical_fungible_balance_delta')
export class FungibleBalanceDeltaEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'bigint', readonly: true})
  id!: string

  @Column({type: 'character', length: 42, readonly: true})
  address?: string

  @Column({type: 'character', length: 42, readonly: true})
  contractAddress?: string

  @Column({type: 'character', length: 42, readonly: true})
  counterpartAddress?: string

  @Column({type: 'character varying', length: 32, readonly: true})
  tokenType!: string

  @Column({type: 'character varying', length: 32, readonly: true})
  deltaType!: string

  @Column({type: 'character', length: 66, readonly: true})
  traceLocationBlockHash!: string

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  traceLocationBlockNumber!: BigNumber

  @Column({type: 'character', length: 66, readonly: true})
  traceLocationTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceLocationTransactionIndex?: number

  @Column({type: 'integer', readonly: true})
  traceLocationLogIndex?: number

  @Column({type: 'character varying', length: 64, readonly: true})
  traceLocationTraceAddress!: string

  @Column({type: 'timestamp', name: 'traceLocationTimestamp', readonly: true})
  timestamp!: Date

  @Column({type: 'boolean', readonly: true})
  isReceiving!: boolean

  @OneToOne(type => TransactionEntity)
  @JoinColumn({
    name: 'traceLocationTransactionHash',
    referencedColumnName: 'hash',
  })
  transaction?: TransactionEntity

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  amount!: BigNumber

}
