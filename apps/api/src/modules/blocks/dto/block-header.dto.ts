import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { assignClean } from '@app/shared/utils'
import { BlockHeader } from '@app/graphql/schema'

export class BlockHeaderDto extends BlockHeader{
  constructor(data: BlockHeaderEntity) {
    super()
    if (data.txs) delete data.txs
    assignClean(this, data)
  }
}
