import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BigNumberTransformer } from '../transformers/big-number.transformer';
import BigNumber from 'bignumber.js';

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

  @Column({type: 'numeric', readonly: true, transformer: new BigNumberTransformer()})
  amount!: BigNumber

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

  @Column({type: 'timestamp', readonly: true})
  timestamp!: Date

}
