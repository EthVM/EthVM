import { TxsPayload } from '@app/server/core/payloads'
import { txsPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Tx } from 'ethvm-models'
import { Events } from '@app/server/core/events'

const getAddressTxsEvent: SocketEvent = {
  id: Events.getAddressTxs, // new_name: get-address-txs

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = txsPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TxsPayload): Promise<Tx[]> =>
    server.txsService.getTxsOfAddress(payload.address, payload.limit, payload.page)
}

export default getAddressTxsEvent
