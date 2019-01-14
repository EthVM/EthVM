import { Block } from '@app/core/models'
import { Block as RawBlock } from 'ethvm-common'

const NEW_BLOCK = (state: any, raw: RawBlock | RawBlock[]) => {
  const blocks = !Array.isArray(raw) ? [raw] : raw
  blocks.forEach(block => state.blocks.add(new Block(block)))
}

export default { NEW_BLOCK }
