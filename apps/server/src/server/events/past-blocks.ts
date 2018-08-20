import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block } from '@app/server/modules/blocks'

const pastBlocksEvent: SocketEvent = {
  id: 'pastBlocks', // new_name: past_blocks

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    return {
      valid: true
    }
  },

  // TODO: Remove fliping blocks from here (blocks should be ordered properly from db)
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block[]> =>
    server.blockService.getBlocks().then(
      (_blocks: Block[]): Block[] => {
        const blocks: Block[] = []
        _blocks.forEach(
          (block: Block): void => {
            blocks.unshift(block)
          }
        )
        return blocks
      }
    )
}

export default pastBlocksEvent
