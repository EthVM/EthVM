import { BlockHeader } from '@app/graphql/schema';
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity';
import { assignClean } from '@app/shared/utils';

export class BlockHeaderDto extends BlockHeader {
  constructor(data: BlockHeaderEntity) {
    super()

    if (data.txs) delete data.txs

    assignClean(this, data)

    if (data.transactionHashes) {
      this.transactionHashes = JSON.parse(data.transactionHashes)
    }

    if (data.uncleHashes) {
      this.uncleHashes = JSON.parse(data.uncleHashes)
    }
  }
}
