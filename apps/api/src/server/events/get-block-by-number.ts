import { blockByNumberPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block, Events } from 'ethvm-common'

const getBlockEvent: SocketEvent = {
  id: Events.getBlockByNumber,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockByNumberPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block | null> => server.blockService.getBlockByNumber(payload.number)
}

export default getBlockEvent
