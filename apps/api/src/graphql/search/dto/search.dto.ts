import { AddressBalance, Block, Search, SearchType, Transaction, Uncle } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class SearchDto implements Search {

  type!: SearchType;
  address?: AddressBalance;
  block?: Block;
  uncle?: Uncle;
  tx?: Transaction;

  constructor(data: any) {
    assignClean(this, data)
  }
}
