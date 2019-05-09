import { Contract, ContractsPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { ContractDto } from '@app/modules/contracts/dto/contract.dto'

export class ContractsPageDto implements ContractsPage {

  items!: ContractDto[];
  totalCount!: number;

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new ContractDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
