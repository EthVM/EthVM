import { Block } from '@app/graphql/schema'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TxDto } from '@app/modules/txs/tx.dto'
import { BlockHeaderDto } from '@app/modules/blocks/block-header.dto'

export class BlockDto extends Block {
  // TODO set data to BlockHeaderEntity
  constructor(data: any) {
    super()

    this.transactions = data.txs ? data.txs.map(tx => new TxDto(tx)) : []
    delete data.txs
    this.header = new BlockHeaderDto(data)

  }
}
