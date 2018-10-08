import { Address } from '@app/server/modules/address'
import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'

export enum searchType {
  Transaction,
  Address,
  Block,
  None
}

export interface Search {
  type: searchType
  address?: Address | null
  block?: Block | null
  tx?: Tx | null
}
