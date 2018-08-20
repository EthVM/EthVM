import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Tx } from '@app/server/modules/txs'

const pastTxsEvent: SocketEvent = {
  id: 'pastTxs', // new_name: past_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    return {
      valid: true
    }
  },

  // TODO: Remove harcoded 64
  onEvent: (server: EthVMServer, socket: SocketIO.Socket): Promise<Tx[]> => server.txsService.getTxs(64, 0)
}

export default pastTxsEvent
