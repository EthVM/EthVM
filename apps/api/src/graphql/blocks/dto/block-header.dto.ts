import { BlockHeader } from '@app/graphql/schema';
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity';
import { assignClean } from '@app/shared/utils';

export class BlockHeaderDto extends BlockHeader {
  constructor(data: BlockHeaderEntity) {
    super()
    assignClean(this, data)
  }
}
