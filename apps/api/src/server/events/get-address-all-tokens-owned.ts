import { removePrefix } from '@app/server/core/utils'
import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, Token } from 'ethvm-common'

const getAddressAllTokensOwned: SocketEvent = {
  id: Events.getAddressAllTokensOwned,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Token[]> =>
    server.tokensService.getAddressAllTokensOwned(removePrefix(payload.address))
}

export default getAddressAllTokensOwned
