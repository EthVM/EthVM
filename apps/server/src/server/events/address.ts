import { BalancePayload } from '@app/server/core/payloads'
import { balancePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Address } from '@app/server/modules/address'

const getAddressEvent: SocketEvent = {
  id: 'getAddress',
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = balancePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: BalancePayload): Promise<Address> => server.addressService.getAddress(payload.address)
}

export default getAddressEvent
