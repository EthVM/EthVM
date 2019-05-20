import { ContractSummary, ContractSummaryPage } from '@app/graphql/schema'
import { ContractSummaryDto } from '@app/graphql/contracts/dto/contract-summary.dto'

export class ContractSummaryPageDto implements ContractSummaryPage {
  items!: ContractSummaryDto[]
  totalCount!: number

  constructor(items: ContractSummary[], totalCount: number) {
    this.items = items.map(s => new ContractSummaryDto(s))
    this.totalCount = totalCount
  }

}
