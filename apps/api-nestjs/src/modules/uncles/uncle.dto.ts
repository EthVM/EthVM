import { Uncle } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class UncleDto extends Uncle {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
