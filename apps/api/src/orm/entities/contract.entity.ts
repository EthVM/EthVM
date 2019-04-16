import { Column, Entity, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_contract')
export class ContractEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @Column({type: 'character', length: 42, readonly: true})
  creator?: string

  @Column({type: 'text', readonly: true})
  init?: string

  @Column({type: 'text', readonly: true})
  code?: string

  @Column({type: 'character', length: 66, readonly: true})
  refundAddress?: string

  @Column({type: 'numeric', readonly: true})
  refundBalance?: string

  @Column({type: 'character', length: 66, readonly: true})
  traceCreatedAtBlockHash?: string

  @Column({type: 'numeric', readonly: true})
  traceCreatedAtBlockNumber?: number

  @Column({type: 'character', length: 66, readonly: true})
  traceCreatedAtTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceCreatedAtTransactionIndex?: number

  @Column({type: 'integer', readonly: true})
  traceCreatedAtLogIndex?: number

  @Column({type: 'character', length: 64, readonly: true})
  traceCreatedAtTraceAddress?: string

  @Column({type: 'character', length: 66, readonly: true})
  traceDestroyedAtBlockHash?: string

  @Column({type: 'numeric', readonly: true})
  traceDestroyedAtBlockNumber?: number

  @Column({type: 'character', length: 66, readonly: true})
  traceDestroyedAtTransactionHash?: string

  @Column({type: 'integer', readonly: true})
  traceDestroyedAtTransactionIndex?: number

  @Column({type: 'integer', readonly: true})
  traceDestroyedAtLogIndex?: number

  @Column({type: 'character', length: 64, readonly: true})
  traceDestroyedAtTraceAddress?: string

  @Column({type: 'text', readonly: true})
  traceDestroyedAt?: string

}
