import { EthplorerTokenInfo } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class EthplorerTokenInfoDto extends EthplorerTokenInfo {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
