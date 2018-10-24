import { pastTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { PendingTx } from 'ethvm-models'

const pendingTxsEvent: SocketEvent = {
  id: 'pendingTxs',

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = pastTxsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<PendingTx[]> => server.pendingTxService.getTxs(payload.limit, payload.page)
}

export default pendingTxsEvent
