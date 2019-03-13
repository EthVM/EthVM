import { AccountMetadata } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class AccountMetadataDto extends AccountMetadata {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
