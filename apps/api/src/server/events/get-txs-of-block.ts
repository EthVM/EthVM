import { removePrefix } from '@app/server/core/utils'
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

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Tx[] | null> => server.txsService.getTxsOfBlock(removePrefix(payload.hash))
}

export default getTxsOfBlockEvent
