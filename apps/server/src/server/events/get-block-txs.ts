import { BlocksTxsPayload } from '@app/server/core/payloads'
import { blockTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Tx } from 'ethvm-models'
import { Events } from '@app/server/core/events'

const getBlockTxsEvent: SocketEvent = {
  id: Events.getBlockTransactions, // new_name: get-block-txs

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
