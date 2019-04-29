import {TransactionSummary, TransactionSummaryPage} from "@app/graphql/schema";
import BigNumber from "bignumber.js";
import {TransactionSummaryDto} from "@app/graphql/txs/dto/transaction-summary.dto";

export class TransactionSummaryPageDto extends TransactionSummaryPage {

  constructor(items: TransactionSummary[], totalCount: number) {
    super()
    this.items = items.map(s => new TransactionSummaryDto(s))
    this.totalCount = new BigNumber(totalCount)
  }

}
