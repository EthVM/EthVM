import { Column } from 'typeorm'
import { EmbeddedReceipt } from '@app/orm/embedded-entities/embedded-receipt'

export class EmbeddedTx {

  @Column({type: 'string', readonly: true})
  blockHash: string

  @Column({type: 'long', readonly: true})
  blockNumber: number

  @Column({type: 'string', readonly: true})
  from: string

  @Column({type: 'string', readonly: true})
  gas: string

  @Column({type: 'string', readonly: true})
  gasPrice: string

  @Column({type: 'string', readonly: true})
  hash: string

  @Column({type: 'string', readonly: true})
  input: string

  @Column({type: 'string', readonly: true})
  nonce: string

  @Column({type: 'string', readonly: true})
  r: string

  @Column({type: 'string', readonly: true})
  s: string

  @Column({type: 'long', readonly: true})
  timestamp: number

  @Column({type: 'string', readonly: true})
  to: string

  @Column({type: 'int', readonly: true})
  transactionIndex: number

  @Column({type: 'long', readonly: true})
  v: number

  @Column({type: 'string', readonly: true})
  value: string

  @Column(type => EmbeddedReceipt)
  receipt: EmbeddedReceipt

}
