import { pastBlockPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block, mappers, SmallBlock } from '@app/server/modules/blocks'
import BigNumber from 'bignumber.js'

const pastBlocksEvent: SocketEvent = {
  id: 'pastBlocks', // new_name: past_blocks

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = pastBlockPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  // TODO: Remove calculation of stats
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<SmallBlock[]> =>
    server.blockService.getBlocks(payload.limit, payload.page).then(
      (_blocks: Block[]): SmallBlock[] => {
        const blocks: SmallBlock[] = []
        _blocks.forEach(
          (block: Block): void => {
            // TODO: Remove harcoded time from zero
            blocks.unshift(mappers.toSmallBlock(block))
          }
        )
        return blocks
      }
    )
}

export default pastBlocksEvent
