import { Account } from '@app/server/modules/accounts'
import { Block } from '@app/server/modules/blocks'
import { Tx } from 'ethvm-models'

export enum SearchType {
  Transaction,
  Address,
  Block,
  None
}

export interface Search {
  type: SearchType
  address?: Account | null
  block?: Block | null
  tx?: Tx | null
}
