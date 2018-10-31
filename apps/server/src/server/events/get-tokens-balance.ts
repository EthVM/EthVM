import { TokensBalancePayload } from '@app/server/core/payloads'
import { tokensBalancePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-models'

const getTokenBalanceEvent: SocketEvent = {
  id: Events.getTokenBalance,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = tokensBalancePayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TokensBalancePayload): Promise<any> => server.vmService.getTokens(payload.address)
}

export default getTokenBalanceEvent
