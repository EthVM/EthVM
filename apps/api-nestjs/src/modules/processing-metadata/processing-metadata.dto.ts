import { ProcessingMetadata } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ProcessingMetadataDto extends ProcessingMetadata {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
