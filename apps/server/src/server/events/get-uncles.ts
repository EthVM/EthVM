import { pastBlockPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Uncle } from 'ethvm-models'
import { Events } from '@app/server/core/events'

const getUnclesEvent: SocketEvent = {
  id: Events.getUncles, // get-uncles

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = pastBlockPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Uncle[]> => server.uncleService.getUncles(payload.limit, payload.page)
}

export default getUnclesEvent
