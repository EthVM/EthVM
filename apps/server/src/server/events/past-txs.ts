import { pastTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Tx } from '@app/server/modules/txs'

const pastTxsEvent: SocketEvent = {
  id: 'pastTxs', // new_name: past_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = pastTxsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  // TODO: Remove fliping txs from here (txs should be ordered properly from db)
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Tx[]> =>
    server.txsService.getTxs(payload.limit, payload.page)
}

export default pastTxsEvent
