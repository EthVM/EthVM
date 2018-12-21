export class Block {
  number?: number
  hash?: string
  header?: Header
  transactions?: string[]
  uncles?: string[]
}

export class Header {
  parentHash?: string
  sha3Uncles?: string
  hash?: string
  number?: number
  timestamp?: number
  nonce?: string
  miner?: string
}

export abstract class IQuery {
  abstract blocks(limit?: number, page?: number): Block[] | Promise<Block[]>

  abstract block(hash?: string): Block | Promise<Block>

  abstract temp__(): boolean | Promise<boolean>
}

export type Date = any
export type JSON = any
