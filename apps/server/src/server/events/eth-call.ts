import { EthCallPayload } from '@app/server/core/payloads'
import { ethCallPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from '@app/server/core/events'

const ethCallEvent: SocketEvent = {
  id: Events.ethCall, // new_id: eth-call

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = ethCallPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  // TODO: Restore proper behavior
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: EthCallPayload): Promise<boolean> => {
    // server.vmService.call(payload.to, payload.data, cb)
    return Promise.resolve(true)
  }
}

export default ethCallEvent
