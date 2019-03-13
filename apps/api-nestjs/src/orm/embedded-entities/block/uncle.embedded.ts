import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class UncleEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'string', readonly: true })
  author: string

  @Column({ type: 'string', readonly: true })
  difficulty: string

  @Column({ type: 'string', readonly: true })
  extraData: string

  @Column({ type: 'string', readonly: true })
  gasLimit: string

  @Column({ type: 'string', readonly: true })
  gasUsed: string

  @Column({ type: 'string', readonly: true })
  hash: string

  @Column({ type: 'string', readonly: true })
  logsBloom: string

  @Column({ type: 'string', readonly: true })
  nonce: string

  @Column({ type: 'long', readonly: true })
  number: number

  @Column({ type: 'string', readonly: true })
  parentHash: string

  @Column({ type: 'string', readonly: true })
  sha3Uncles: string

  @Column({ type: 'long', readonly: true })
  size: number

  @Column({ type: 'string', readonly: true })
  stateRoot: string

  @Column({ type: 'long', readonly: true })
  timestamp: number

  @Column({ type: 'string', readonly: true })
  transactionsRoot: string

  @Column({ type: 'string', readonly: true })
  uncleReward: string
}
