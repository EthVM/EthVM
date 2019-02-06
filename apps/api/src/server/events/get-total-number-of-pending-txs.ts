import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-common'

const getNumberOfPendingTxs: SocketEvent = {
  id: Events.getTotalNumberOfPendingTxs,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = true
    return {
      valid,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<number> =>
    server.pendingTxService.getTotalNumberOfPendingTxs()
}

export default getNumberOfPendingTxs
