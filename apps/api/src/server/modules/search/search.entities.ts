import { AddressBalance, Block, Tx } from 'ethvm-common'

export enum SearchType {
  Transaction,
  Address,
  Block,
  None
}

export interface Search {
  type: SearchType
  address?: AddressBalance | null
  block?: Block | null
  tx?: Tx | null
}
