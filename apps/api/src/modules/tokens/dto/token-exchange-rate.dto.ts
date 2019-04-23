import { TokenExchangeRate } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenExchangeRateDto extends TokenExchangeRate {
  constructor(data: any) {
    super()
    assignClean(this, data)
  }
}
