import { TotalTxsPayload } from '@app/server/core/payloads'
import { totalTxsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-common'

const getAccountTotalTxsEvent: SocketEvent = {
  id: Events.getAccountTotalTxs,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = totalTxsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TotalTxsPayload): Promise<number> =>
    server.accountsService.getAccountTotalTxs(payload.address)
}

export default getAccountTotalTxsEvent
