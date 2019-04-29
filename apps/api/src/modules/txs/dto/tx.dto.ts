import { Transaction } from '@app/graphql/schema'
import { assignClean, isGzip } from '@app/shared/utils'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TxReceiptDto } from '@app/modules/txs/dto/tx-receipt.dto'
import { TxTraceDto } from '@app/modules/txs/dto/tx-trace.dto'
import zlib from 'zlib'

export class TxDto extends Transaction {
  constructor(data: TransactionEntity) {
    super()

    // Convert relations to Dto instances

    const { receipt, traces } = data
    if (receipt) {
      this.receipt = new TxReceiptDto(receipt)
    }
    if (traces && traces.length) {
      this.traces = traces.map(t => new TxTraceDto(t))
    }
    delete data.receipt
    delete data.traces

    assignClean(this, data)

    // Decompress input field if necessary

    const { input } = data
    if (input && isGzip(input)) {
      this.input = zlib.gunzipSync(input)
    }

  }
}
