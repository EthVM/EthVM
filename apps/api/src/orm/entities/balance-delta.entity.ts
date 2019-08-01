import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '@app/orm/transformers/big-number.transformer'
import BigNumber from 'bignumber.js'
import { DateTransformer } from '@app/orm/transformers/date.transformer'

@Entity('canonical_balance_delta')
export class BalanceDeltaEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({type: 'bigint', readonly: true})
  id!: string

  @PrimaryColumn({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  tokenId?: BigNumber

  // isReceiving must be part of unique primary key until double-entry system implemented for non_fungible_balance_delta table
  @PrimaryColumn({type: 'boolean', readonly: true})
  isReceiving!: boolean

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

  @Column({ type: 'timestamp', readonly: true, transformer: new DateTransformer() })
  timestamp!: Date

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  amount!: BigNumber

}
