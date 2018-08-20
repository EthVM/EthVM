import { logger } from '@app/logger'
import { JoinLeavePayload } from '@app/server/core/payloads'
import { joinLeavePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'

const leaveEvent: SocketEvent = {
  id: 'leave',

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = joinLeavePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: JoinLeavePayload): Promise<any> => {
    payload.rooms.forEach(room => {
      logger.debug(`event -> leave / Leaving room: ${payload}`)
      socket.join(room)
    })
    return Promise.resolve(undefined)
  }
}

export default leaveEvent
