import { Search } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class SearchDto extends Search {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
