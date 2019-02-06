import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-common'

const getTotalNumberOfUncles: SocketEvent = {
  id: Events.getTotalNumberOfUncles,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = true
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<number> => server.uncleService.getTotalNumberOfUncles()
}

export default getTotalNumberOfUncles
