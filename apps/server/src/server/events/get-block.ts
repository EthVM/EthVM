import { blockPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block } from 'ethvm-models'
import { Events } from '@app/server/core/events'

const getBlockEvent: SocketEvent = {
  id: Events.getBlock, // new_name: get-block

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block | null> => server.blockService.getBlock(payload.hash)
}

export default getBlockEvent
