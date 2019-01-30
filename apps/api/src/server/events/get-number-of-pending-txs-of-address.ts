import { removePrefix } from '@app/server/core/utils'
import { txsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-common'

const getNumberOfPendingTxsOfAddress: SocketEvent = {
  id: Events.getNumberOfPendingTxsOfAddress,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = txsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<number> =>
    server.pendingTxService.getNumberOfPendingTxsOfAddress(removePrefix(payload.address))
}

export default getNumberOfPendingTxsOfAddress
