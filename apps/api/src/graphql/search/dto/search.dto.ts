import { Block, Search, SearchType, Transaction, Uncle, Account, TokenSearchResult } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class SearchDto implements Search {

  type!: SearchType
  address?: Account
  block?: Block
  uncle?: Uncle
  tx?: Transaction
  tokens?: TokenSearchResult[]

  constructor(data: any) {
    assignClean(this, data)
  }
}
