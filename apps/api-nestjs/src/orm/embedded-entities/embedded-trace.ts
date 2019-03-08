import { Column } from 'typeorm'

export class EmbeddedTrace {

  @Column({type: 'string', readonly: true})
  blockHash: string

  @Column({type: 'long', readonly: true})
  blockNumber: number

  @Column({type: 'int', readonly: true})
  subtraces: number

  @Column({type: 'array', readonly: true})
  traceAddress: number[]

  @Column({type: 'string', readonly: true})
  transactionHash: string

  @Column({type: 'int', readonly: true})
  transactionPosition: number

  @Column({type: 'string', readonly: true})
  type: string

  // TODO action class
  @Column()
  action: any;

  // TODO error

  // TODO result class

}
