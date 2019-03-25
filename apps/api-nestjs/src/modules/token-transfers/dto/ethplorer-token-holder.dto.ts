import { EthplorerTokenHolder } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class EthplorerTokenHolderDto extends EthplorerTokenHolder {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
