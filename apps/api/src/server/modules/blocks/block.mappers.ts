import { toSimpleTx } from '@app/server/modules/txs'
import { Block } from 'ethvm-common'

const toBlock = (block: any, format: string = 'full'): Block => {
  switch (format) {
    case 'simple':
      return toSimpleBlock(block)
    default:
      return block
  }
}

const toSimpleBlock = (block: any): Block => {
  const b: any = {}
  b.header = {}
  b.header.number = block.header.number
  b.header.hash = block.header.hash
  b.header.author = block.header.author
  b.rewards = block.rewards || []
  b.transactions = block.transactions ? block.transactions.map(tx => toSimpleTx(tx)) : []
  return b
}

export { toBlock, toSimpleBlock }
