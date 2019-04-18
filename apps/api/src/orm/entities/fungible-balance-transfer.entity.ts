import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_fungible_balance_transfer')
export class FungibleBalanceTransferEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'bigint', readonly: true})
  id!: string

  @Column({type: 'character', length: 42, readonly: true})
  to!: string

  @Column({type: 'character varying', length: 32, readonly: true})
  deltaType!: string

  @Column({type: 'character', length: 42, readonly: true})
  from?: string

  @Column({type: 'character', length: 42, readonly: true})
  contractAddress?: string

  @Column({type: 'character varying', length: 32, readonly: true})
  tokenType!: string

  @Column({type: 'numeric', readonly: true})
  amount!: string

  @Column({type: 'character', length: 66, readonly: true})
  traceLocationBlockHash!: string

  @Column({type: 'numeric', readonly: true})
  traceLocationBlockNumber!: string

  @Column({type: 'character', length: 66, readonly: true})
  traceLocationTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceLocationTransactionIndex?: number

  @Column({type: 'integer', readonly: true})
  traceLocationLogIndex?: number

  @Column({type: 'character varying', length: 64, readonly: true})
  traceLocationTraceAddress!: string

  @Column({type: 'bigint', readonly: true})
  timestamp!: string

}
