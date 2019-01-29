import { removePrefix } from '@app/server/core/utils'
import { blockPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block, Events } from 'ethvm-common'

const getBlockEvent: SocketEvent = {
  id: Events.getBlock,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block | null> => server.blockService.getBlock(removePrefix(payload.hash))
}

export default getBlockEvent
