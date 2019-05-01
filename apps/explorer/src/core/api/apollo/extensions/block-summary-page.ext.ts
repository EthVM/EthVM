import {BlockSummaryPage, BlockSummaryPage_items} from "@app/core/api/apollo/types/BlockSummaryPage";
import {BlockSummaryExt} from "@app/core/api/apollo/extensions/block-summary.ext";
import {BlockSummary} from "@app/core/api/apollo/types/BlockSummary";
import BN from "bignumber.js";


export class BlockSummaryPageExt implements BlockSummaryPage {

  __typename!: "BlockSummaryPage";
  items!: (BlockSummaryExt | null)[] | null;
  totalCount!: any | null;

  constructor(proto: BlockSummaryPage) {
    this.items = proto.items!.map(s => new BlockSummaryExt(s))
    this.totalCount = proto.totalCount
  }

  get totalCountBN(): BN {
    return new BN(this.totalCount, 16)
  }
}
