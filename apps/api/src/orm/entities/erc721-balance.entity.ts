import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_erc721_balance')
export class Erc721BalanceEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  contract!: string

  @PrimaryColumn({type: 'numeric', readonly: true})
  tokenId!: string

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'character', length: 66, readonly: true})
  traceLocationBlockHash?: string

  @Column({type: 'numeric', readonly: true})
  traceLocationBlockNumber?: string

  @Column({type: 'character', length: 66, readonly: true})
  traceLocationTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceLocationTransactionIndex?: string

  @Column({type: 'integer', readonly: true})
  traceLocationLogIndex?: string

  @Column({type: 'character', length: 64, readonly: true})
  traceLocationTraceAddress?: string

}
