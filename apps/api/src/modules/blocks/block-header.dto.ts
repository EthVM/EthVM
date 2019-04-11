import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { assignClean } from '@app/shared/utils'

export class BlockHeaderDto {
  constructor(data: BlockHeaderEntity) {
    assignClean(this, data)

  }
}
