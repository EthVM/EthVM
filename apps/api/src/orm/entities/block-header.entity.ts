import { Entity, PrimaryColumn, Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

@Entity('canonical_block_header')
export class BlockHeaderEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'numeric', readonly: true})
  number!: number

  @Column({type: 'character', length: 66, unique: true, readonly: true})
  hash!: string

  @Column({type: 'character', length: 66, unique: true})
  parentHash!: string

  @Column({type: 'numeric', readonly: true})
  nonce?: number

  @Column({type: 'character', length: 66, readonly: true})
  sha3Uncles!: string

  @Column({type: 'character', length: 514, readonly: true})
  logsBloom!: string

  @Column({type: 'character', length: 66, readonly: true})
  transactionsRoot!: string

  @Column({type: 'character', length: 66, readonly: true})
  stateRoot!: string

  @Column({type: 'character', length: 66, readonly: true})
  receiptsRoot!: string

  @Column({type: 'character', length: 66, readonly: true})
  author!: string

  @Column({type: 'numeric', readonly: true})
  difficulty!: number

  @Column({type: 'numeric', readonly: true})
  totalDifficulty!: number

  @Column({type: 'text', readonly: true})
  extraData?: string

  @Column({type: 'numeric', readonly: true})
  gasLimit!: number

  @Column({type: 'numeric', readonly: true})
  gasUsed!: number

  @Column({type: 'bigint', readonly: true})
  timestamp!: number

  @Column({type: 'bigint', readonly: true})
  size!: number

  @Column({type: 'bigint', readonly: true})
  blockTime?: number

}
