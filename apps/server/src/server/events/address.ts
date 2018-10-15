import { BalancePayload } from '@app/server/core/payloads'
import { balancePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Account } from '@app/server/modules/accounts'

const getAddressEvent: SocketEvent = {
  id: 'getAddress',

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = balancePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: BalancePayload): Promise<Account | null> =>
    server.accountsService.getAccount(payload.address)
}

export default getAddressEvent
