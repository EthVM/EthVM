import { Metadata } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class MetadataDto implements Metadata {

  isSyncing!: boolean

  constructor(data: any) {
    assignClean(this, data)
  }
  
}
