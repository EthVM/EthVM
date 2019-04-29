import {BlockSummaryPage, BlockSummaryPage_summaries} from "@app/core/api/apollo/types/BlockSummaryPage";
import {BlockSummaryExt} from "@app/core/api/apollo/extensions/block-summary.ext";
import {BlockSummary} from "@app/core/api/apollo/types/BlockSummary";
import BN from "bignumber.js";


export class BlockSummaryPageExt implements BlockSummaryPage {

  __typename!: "BlockSummaryPage";
  summaries!: (BlockSummaryPage_summaries | null)[] | null;
  totalCount!: any | null;

  constructor(proto: BlockSummaryPage) {
    this.summaries = proto.summaries!.map(s => new BlockSummaryExt(s as BlockSummary))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount, 16)
  }
}
