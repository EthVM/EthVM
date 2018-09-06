import { BlocksTxsPayload } from '@app/server/core/payloads'
import { blockTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Tx } from '@app/server/modules/txs'

const getBlockTxsEvent: SocketEvent = {
  id: 'getBlockTransactions', // new_name: block_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockTxsPayloadValidator(payload) as boolean

    return {
      valid,
      errors: [valid] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: BlocksTxsPayload): Promise<Tx[] | null> => server.txsService.getBlockTxs(payload.hash)
}

export default getBlockTxsEvent
