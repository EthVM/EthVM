import { Block } from '@app/graphql/schema'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { BlockHeaderDto } from '@app/graphql/blocks/dto/block-header.dto'
import { BlockRewardDto } from '@app/graphql/blocks/dto/block-reward.dto'

export class BlockDto implements Block {

  header: BlockHeaderDto
  rewards: BlockRewardDto[]
  transactionHashes: string[]
  uncleHashes: string[]

  constructor(data: BlockHeaderEntity) {

    this.transactionHashes = data.transactionHashes ? JSON.parse(data.transactionHashes) : undefined
    this.uncleHashes = data.uncleHashes ? JSON.parse(data.uncleHashes) : undefined
    this.rewards = data.rewards ? data.rewards.map(reward => new BlockRewardDto(reward)) : []
    this.header = new BlockHeaderDto(data)

  }
}
