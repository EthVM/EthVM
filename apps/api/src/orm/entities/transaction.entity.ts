import { Entity, Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_transaction')
export class TransactionEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @Column({type: 'character', length: 66, readonly: true})
  hash?: string

  @Column({type: 'numeric', readonly: true})
  nonce?: number

  @Column({type: 'character', length: 66, readonly: true})
  blockHash?: string

  @Column({type: 'numeric', readonly: true})
  blockNumber?: number

  @Column({type: 'integer', readonly: true})
  transactionIndex?: number

  @Column({type: 'character', length: 66, readonly: true})
  from?: string

  @Column({type: 'character', length: 66, readonly: true})
  to?: string

  @Column({type: 'numeric', readonly: true})
  value?: number

  @Column({type: 'numeric', readonly: true})
  gasPrice?: number

  @Column({type: 'numeric', readonly: true})
  gas?: number

  @Column({type: 'bytea', readonly: true})
  input?: Buffer  // TODO check typing is correct

  @Column({type: 'bigint', readonly: true})
  v?: number

  @Column({type: 'character', length: 78, readonly: true})
  r?: string

  @Column({type: 'character', length: 78, readonly: true})
  s?: string

  @Column({type: 'bigint', readonly: true})
  timestamp?: number

  @Column({type: 'character', length: 66, readonly: true})
  creates?: string

  @Column({type: 'bigint', readonly: true})
  chainId?: number

}
