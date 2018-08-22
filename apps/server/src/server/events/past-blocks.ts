import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block } from '@app/server/modules/blocks'

const pastBlocksEvent: SocketEvent = {
  id: 'pastBlocks', // new_name: past_blocks

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    return {
      valid: true
    }
  },

  // TODO: Remove hardcoded 64 value
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block[]> => server.blockService.getBlocks(64, 0)
}

export default pastBlocksEvent
