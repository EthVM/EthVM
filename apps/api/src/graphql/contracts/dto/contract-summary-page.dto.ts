import { ContractSummary, ContractSummaryPage } from '@app/graphql/schema'
import { ContractSummaryDto } from '@app/graphql/contracts/dto/contract-summary.dto'
import BigNumber from 'bignumber.js';

export class ContractSummaryPageDto implements ContractSummaryPage {
  items!: ContractSummaryDto[]
  hasMore!: boolean
  totalCount!: BigNumber

  constructor(items: ContractSummary[], hasMore: boolean, totalCount: BigNumber) {
    this.items = items.map(s => new ContractSummaryDto(s))
    this.hasMore = hasMore
    this.totalCount = totalCount
  }

}
