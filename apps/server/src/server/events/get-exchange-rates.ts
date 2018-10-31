import { ExchangeRatePayload } from '@app/server/core/payloads/ExchangeRatePayload'
import { exchangeRatePayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-models'

const getExchangeRatesEvent: SocketEvent = {
  id: Events.getExchangeRates,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = exchangeRatePayloadValidator(payload) as boolean
    return {
      valid,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: ExchangeRatePayload): Promise<any> =>
    server.exchangesService.getExchangeRate(payload.symbol, payload.to)
}

export default getExchangeRatesEvent
