import { TokenSearchResult } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import BigNumber from 'bignumber.js'

export class TokenSearchResultDto implements TokenSearchResult {

  contractAddress!: string
  currentPrice?: BigNumber
  image?: string
  name?: string
  symbol?: string
  website?: string

  constructor(data: any) {
    assignClean(this, data)
  }
}
