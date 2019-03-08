import { Column } from 'typeorm'

export class EmbeddedLog {

  @Column({type: 'string', readonly: true})
  address: string

  @Column({type: 'string', readonly: true})
  data: string

  @Column({type: 'array', readonly: true})
  topics: string[]

}
