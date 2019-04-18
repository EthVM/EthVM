import { assignClean } from '@app/shared/utils'
import { EthplorerTokenInfo } from '@app/graphql/schema'

export class EthplorerTokenInfoDto extends EthplorerTokenInfo {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
