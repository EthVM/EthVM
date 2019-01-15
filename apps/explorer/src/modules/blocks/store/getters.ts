import { Block } from '@app/core/models'

export default {
  blocks: (state: any): Block[] => state.blocks.items()
}
