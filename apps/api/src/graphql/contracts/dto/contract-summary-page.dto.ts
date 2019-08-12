import { ContractSummary, ContractSummaryPage } from '@app/graphql/schema'
import { ContractSummaryDto } from '@app/graphql/contracts/dto/contract-summary.dto'

export class ContractSummaryPageDto implements ContractSummaryPage {
  items!: ContractSummaryDto[]
  hasMore!: boolean

  constructor(items: ContractSummary[], hasMore: boolean) {
    this.items = items.map(s => new ContractSummaryDto(s))
    this.hasMore = hasMore
  }

}
