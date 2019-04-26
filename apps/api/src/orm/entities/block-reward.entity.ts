import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'

@Entity('canonical_block_reward')
export class BlockRewardEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({type: 'character', length: 42, readonly: true})
  address!: string

  @PrimaryColumn({type: 'character', length: 66, readonly: true})
  blockHash!: string

  @PrimaryColumn({type: 'character varying', length: 32, readonly: true})
  deltaType!: string

  @Column({type: 'numeric', readonly: true})
  amount!: string

  @ManyToOne(type => BlockHeaderEntity, block => block.rewards)
  @JoinColumn({
    name: 'blockHash',
    referencedColumnName: 'hash',
  })
  blockHeader!: BlockHeaderEntity

}
