import { blockPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Uncle } from 'ethvm-models'
import { Events } from '@app/server/core/events'

const getUncleEvent: SocketEvent = {
  id: Events.getUncle, // new name: get-uncle

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Uncle | null> => server.uncleService.getUncle(payload.hash)
}

export default getUncleEvent
