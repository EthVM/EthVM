import { removePrefix } from '@app/server/core/utils'
import { totalTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-common'

const getAddressTotalTxsEvent: SocketEvent = {
  id: Events.getAddressTotalTxs,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = totalTxsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<number> => server.txsService.getAddressTotalTxs(removePrefix(payload.address))
}

export default getAddressTotalTxsEvent
