import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_fungible_balance_transfer')
export class FungibleBalanceTransferEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  to!: string

  @PrimaryColumn({type: 'character varying', length: 32, readonly: true})
  deltaType!: string

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  from?: string

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  contractAddress?: string

  @Column({type: 'character varying', length: 32, readonly: true})
  tokenType!: string

  @Column({type: 'numeric', readonly: true})
  amount!: string

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  traceLocationBlockHash!: string

  @Column({type: 'numeric', readonly: true})
  traceLocationBlockNumber!: string

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  traceLocationTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceLocationTransactionIndex?: number

  @PrimaryColumn({type: 'integer', readonly: true})
  traceLocationLogIndex?: number

  @PrimaryColumn({type: 'character varying', length: 64, readonly: true})
  traceLocationTraceAddress!: string

  @Column({type: 'bigint', readonly: true})
  timestamp!: string

}
