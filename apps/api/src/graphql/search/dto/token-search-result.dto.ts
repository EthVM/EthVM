import { TokenSearchResult } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class TokenSearchResultDto implements TokenSearchResult {

  address!: string
  currentPrice?: BigNumber
  logo?: string
  name?: string
  symbol?: string
  website?: string

  constructor(data: any) {
    assignClean(this, data)
  }
}
