import { removePrefix } from '@app/server/core/utils'
import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, Tx } from 'ethvm-common'

const getAddressTxsEvent: SocketEvent = {
  id: Events.getAddressTxs,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Tx[]> =>
    server.txsService.getTxsOfAddress(removePrefix(payload.address), payload.filter, payload.limit, payload.page)
}

export default getAddressTxsEvent
