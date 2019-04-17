import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { Column } from 'typeorm/decorator/columns/Column'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'

@Entity('canonical_uncle')
export class UncleEntity {

  constructor(data: any) {
    assignClean(this, data)
  }

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  hash!: string

  @Column({type: 'numeric', readonly: true})
  nephewNumber!: string

  @Column({type: 'character', length: 66, readonly: true})
  nephewHash!: string

  @Column({type: 'numeric', readonly: true})
  number!: string

  @Column({type: 'numeric', readonly: true})
  height!: string

  @Column({type: 'character', length: 66, readonly: true})
  parentHash!: string

  @Column({type: 'numeric', readonly: true})
  nonce?: string

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

  @Column({type: 'character', length: 42, readonly: true})
  author!: string

  @Column({type: 'numeric', readonly: true})
  difficulty!: string

  @Column({type: 'numeric', readonly: true})
  totalDifficulty!: string

  @Column({type: 'text', readonly: true})
  extraData?: string

  @Column({type: 'numeric', readonly: true})
  gasLimit!: string

  @Column({type: 'numeric', readonly: true})
  gasUsed!: string

  @Column({type: 'bigint', readonly: true})
  timestamp!: string

  @Column({type: 'bigint', readonly: true})
  size!: string

  @ManyToOne(type => BlockHeaderEntity, block => block.uncles)
  @JoinColumn({
    name: 'nephewHash',
    referencedColumnName: 'hash',
  })
  blockHeader!: BlockHeaderEntity

}
