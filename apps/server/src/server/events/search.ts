import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Search } from '@app/server/modules/search'
import { Events } from '@app/server/core/events'

const searchEvent: SocketEvent = {
  id: Events.search,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = true
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Search> => server.searchService.search(payload.hash)
}

export default searchEvent
