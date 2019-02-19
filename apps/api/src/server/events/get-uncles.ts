import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, Uncle } from 'ethvm-common'

const getUnclesEvent: SocketEvent = {
  id: Events.getUncles,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Uncle[]> => server.uncleService.getUncles(payload.limit, payload.page, payload.fromUncle)
}

export default getUnclesEvent
