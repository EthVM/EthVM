import { TransactionSummary, TransactionSummaryPage } from '@app/graphql/schema'
import { TransactionSummaryDto } from '@app/graphql/txs/dto/transaction-summary.dto'
import BigNumber from 'bignumber.js'

export class TransactionSummaryPageDto implements TransactionSummaryPage {

  items: TransactionSummaryDto[]
  totalCount: BigNumber

  constructor(items: TransactionSummary[], totalCount: BigNumber) {
    this.items = items.map(s => new TransactionSummaryDto(s))
    this.totalCount = totalCount
  }

}
