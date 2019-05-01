import { Block } from '@app/graphql/schema'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TxDto } from '@app/graphql/txs/dto/tx.dto'
import { BlockHeaderDto } from '@app/graphql/blocks/dto/block-header.dto'
import { UncleDto } from '@app/graphql/uncles/uncle.dto'
import { BlockRewardDto } from '@app/graphql/blocks/dto/block-reward.dto'

export class BlockDto extends Block {
  constructor(data: BlockHeaderEntity) {
    super()

    this.transactions = data.txs ? data.txs.map(tx => new TxDto(tx)) : []
    delete data.txs
    this.uncles = data.uncles ? data.uncles.map(uncle => new UncleDto(uncle)) : []
    delete data.uncles
    this.rewards = data.rewards ? data.rewards.map(reward => new BlockRewardDto(reward)) : []
    delete data.rewards
    this.header = new BlockHeaderDto(data)

  }
}
