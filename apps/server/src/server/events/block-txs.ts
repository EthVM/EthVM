import { BlocksTxsPayload } from '@app/server/core/payloads'
import { blockTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Block } from '@app/server/modules/blocks'

const getBlockTxsEvent: SocketEvent = {
  id: 'getBlockTransactions', // new_name: block_txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockTxsPayloadValidator(payload) as boolean

    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: BlocksTxsPayload): Promise<Block | null> => server.blockService.getBlockTxs(payload.hash)
}

export default getBlockTxsEvent
