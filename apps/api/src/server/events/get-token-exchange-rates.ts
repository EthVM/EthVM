import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, TokenExchangeRate } from 'ethvm-common'

const getTokenExchangeRates: SocketEvent = {
  id: Events.getTokenExchangeRates,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<TokenExchangeRate[]> =>
    server.exchangesService.getTokenExchangeRates(payload.filter, payload.limit, payload.page)
}

export default getTokenExchangeRates
