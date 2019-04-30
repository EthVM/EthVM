import { ContractsPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { ContractDto } from '@app/modules/contracts/dto/contract.dto'

export class ContractsPageDto extends ContractsPage {
  constructor(data: any) {
    super()
    if (data.items) {
      this.items = data.items.map(i => new ContractDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
