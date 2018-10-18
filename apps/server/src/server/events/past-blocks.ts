import { pastBlockPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block } from '@app/server/modules/blocks'

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
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block[]> => server.blockService.getBlocks(payload.limit, payload.page)
}

export default pastBlocksEvent
