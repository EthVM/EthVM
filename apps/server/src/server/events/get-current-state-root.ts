import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events } from '@app/server/core/events'

const getCurrentStateRootEvent: SocketEvent = {
  id: Events.getCurrentStateRoot, // new_name: get-current-state-root

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    return {
      valid: true,
      errors: []
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket): Promise<Buffer> => server.vmService.getCurrentStateRoot()
}

export default getCurrentStateRootEvent
