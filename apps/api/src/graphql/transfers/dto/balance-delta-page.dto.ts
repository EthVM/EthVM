import { Transaction, Transfer, TransferPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { BalanceDeltaDto } from '@app/graphql/transfers/dto/balance-delta.dto'
import { TxDto } from '@app/graphql/txs/dto/tx.dto'

export class BalanceDeltaPageDto implements TransferPage {
  items!: Transfer[]
  txs?: Transaction[]
  hasMore!: boolean

  constructor(data: any) {
    if (data.transfers) {
      this.items = data.transfers.map(i => new BalanceDeltaDto(i))
      delete data.transfers
    }
    if (data.txs) {
      this.txs = data.txs.map(t => new TxDto(t))
      delete data.txs
    }
    assignClean(this, data)
  }

}
