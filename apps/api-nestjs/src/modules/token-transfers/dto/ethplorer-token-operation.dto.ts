import { EthplorerTokenOperation } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class EthplorerTokenOperationDto extends EthplorerTokenOperation {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
