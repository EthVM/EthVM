import {BlockSummary, BlockSummaryPage} from "@app/graphql/schema";
import {BlockSummaryDto} from "@app/graphql/blocks/dto/block-summary.dto";
import BigNumber from "bignumber.js";


export class BlockSummaryPageDto extends BlockSummaryPage {

  constructor(summaries: BlockSummary[], totalCount: number) {
    super()
    this.summaries = summaries.map(s => new BlockSummaryDto(s))
    this.totalCount = new BigNumber(totalCount)
  }


}
