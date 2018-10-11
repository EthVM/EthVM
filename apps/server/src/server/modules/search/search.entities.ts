import { Address } from '@app/server/modules/address'
import { Block } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'

export enum SearchType {
  Transaction,
  Address,
  Block,
  None
}

export interface Search {
  type: SearchType
  address?: Address | null
  block?: Block | null
  tx?: Tx | null
}
