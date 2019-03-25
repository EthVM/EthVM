import { EthplorerAddressInfo } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class EthplorerAddressInfoDto extends EthplorerAddressInfo {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
