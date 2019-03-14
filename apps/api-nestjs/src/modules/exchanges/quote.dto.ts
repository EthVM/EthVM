import { Quote } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class QuoteDto extends Quote {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
