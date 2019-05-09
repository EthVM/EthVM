import { TransactionSummary, TransactionSummaryPage } from '@app/graphql/schema'
import { TransactionSummaryDto } from '@app/graphql/txs/dto/transaction-summary.dto'

export class TransactionSummaryPageDto implements TransactionSummaryPage {

  items: TransactionSummaryDto[];
  totalCount: number;

  constructor(items: TransactionSummary[], totalCount: number) {
    this.items = items.map(s => new TransactionSummaryDto(s))
    this.totalCount = totalCount
  }

}
