import {AddressBalance, Block, Search, SearchType, Transaction, Uncle} from '@app/graphql/schema'
import {BlockDto} from '@app/graphql/blocks/dto/block.dto'
import {UncleDto} from '@app/graphql/uncles/dto/uncle.dto'
import {TxDto} from '@app/graphql/txs/dto/tx.dto'
import {AccountDto} from '@app/graphql/accounts/dto/account.dto'

export class SearchDto implements Search {

  type!: SearchType
  address?: AddressBalance
  block?: Block
  uncle?: Uncle
  tx?: Transaction

  constructor(type: SearchType, address?: AccountDto, block?: BlockDto, uncle?: UncleDto, tx?: TxDto) {
    this.type = type
    this.address = address
    this.block = block
    this.uncle = uncle
    this.tx = tx
  }
}
