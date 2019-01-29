import { balancePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { AddressMetadata, Events } from 'ethvm-common'

const getAddressMetadata: SocketEvent = {
  id: Events.getAddressMetadata,
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = balancePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<AddressMetadata | null> =>
    server.addressesService.getAddressMetadata(payload.address)
}

export default getAddressMetadata
