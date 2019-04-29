import BN from "bignumber.js";
import {TransactionSummaryPage, TransactionSummaryPage_items} from "@app/core/api/apollo/types/TransactionSummaryPage";
import {TransactionSummary} from "@app/core/api/apollo/types/TransactionSummary";
import {TransactionSummaryExt} from "@app/core/api/apollo/extensions/transaction-summary.ext";


export class TransactionSummaryPageExt implements TransactionSummaryPage {

  __typename!: "TransactionSummaryPage";
  items: (TransactionSummaryPage_items | null)[] | null;
  totalCount: any | null;

  constructor(proto: TransactionSummaryPage) {
    this.items = proto.items!.map(s => new TransactionSummaryExt(s as TransactionSummary))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount, 16)
  }
}
