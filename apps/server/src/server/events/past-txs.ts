import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Tx } from '@app/server/modules/txs'

const pastTxsEvent: SocketEvent = {
  id: 'pastTxs', // new_name: past_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    return {
      valid: true
    }
  },

  // TODO: Remove fliping txs from here (txs should be ordered properly from db)
  onEvent: (server: EthVMServer, socket: SocketIO.Socket): Promise<Tx[]> =>
    server.txsService.getTxs().then(
      (_txs: Tx[]): Tx[] => {
        const txs: Tx[] = []
        _txs.forEach((t: Tx) => {
          txs.unshift(t)
        })

        return txs
      }
    )
}

export default pastTxsEvent
