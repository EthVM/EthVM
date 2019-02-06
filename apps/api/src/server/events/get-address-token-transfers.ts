import { removePrefix } from '@app/server/core/utils'
import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, TokenTransfer } from 'ethvm-common'

const getAddressTokenTransfers: SocketEvent = {
  id: Events.getAddressTokenTransfers,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<TokenTransfer[]> =>
    server.tokensService.getAddressTokenTransfers(removePrefix(payload.address), payload.limit, payload.page)
}

export default getAddressTokenTransfers
