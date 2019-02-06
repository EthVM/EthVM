import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, PendingTx } from 'ethvm-common'

const pendingTxsEvent: SocketEvent = {
  id: Events.getPendingTxs,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<PendingTx[]> => server.pendingTxService.getPendingTxs(payload.limit, payload.page)
}

export default pendingTxsEvent
