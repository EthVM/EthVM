import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from 'ethvm-common'

const getTotalNumberOfTokenExchangeRates: SocketEvent = {
  id: Events.getTotalNumberOfTokenExchangeRates,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = true
    return {
      valid,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<number> =>
    server.exchangesService.getTotalNumberOfTokenExchangeRates()
}

export default getTotalNumberOfTokenExchangeRates
