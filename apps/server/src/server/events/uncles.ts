import { pastBlockPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Uncle } from '@app/server/modules/uncle'

const getUnclesEvent: SocketEvent = {
  id: 'uncles',

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
