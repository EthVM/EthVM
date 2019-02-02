import { removePrefix } from '@app/server/core/utils'
import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, PendingTx } from 'ethvm-common'

const getAddressPendingTxsEvent: SocketEvent = {
  id: Events.getPendingTxsOfAddress,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<PendingTx[]> =>
    server.pendingTxService.getPendingTxsOfAddress(removePrefix(payload.address), payload.filter, payload.limit, payload.page)
}

export default getAddressPendingTxsEvent
