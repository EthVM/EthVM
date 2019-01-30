import { removePrefix } from '@app/server/core/utils'
import { searchpayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Search } from '@app/server/modules/search'
import { Events } from 'ethvm-common'

const searchEvent: SocketEvent = {
  id: Events.search,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = searchpayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Search> => server.searchService.search(removePrefix(payload.hash))
}

export default searchEvent
