import { BlocksTxsPayload } from '@app/server/core/payloads'
import { blockTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, Tx } from 'ethvm-common'

const getTxsOfBlockEvent: SocketEvent = {
  id: Events.getBlockTxs,
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockTxsPayloadValidator(payload) as boolean

    return {
      valid,
      errors: [valid] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: BlocksTxsPayload): Promise<Tx[] | null> => server.txsService.getTxsOfBlock(payload.hash)
}

export default getTxsOfBlockEvent
