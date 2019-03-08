import { Column } from 'typeorm'
import { EmbeddedLog } from '@app/orm/embedded-entities/embedded-log'
import { EmbeddedTrace } from '@app/orm/embedded-entities/embedded-trace'

export class EmbeddedReceipt {

  @Column({type: 'string', readonly: true})
  blockHash: string

  @Column({type: 'long', readonly: true})
  blockNumber: number;

  @Column({type: 'string', readonly: true})
  contractAddress: string

  @Column({type: 'string', readonly: true})
  cumulativeGasUsed: string

  @Column({type: 'string', readonly: true})
  gasUsed: string

  @Column({type: 'string', readonly: true})
  logsBloom: string

  @Column({type: 'int', readonly: true})
  numInternalTxs: number

  @Column({type: 'string', readonly: true})
  root: string

  @Column({type: 'string', readonly: true})
  transactionHash: string

  @Column({type: 'string', readonly: true})
  transactionIndex: string

  @Column(type => EmbeddedLog)
  logs: EmbeddedLog[];

  @Column(type => EmbeddedTrace)
  traces: EmbeddedTrace[];

}
