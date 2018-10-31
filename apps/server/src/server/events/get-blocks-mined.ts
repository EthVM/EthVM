import { blockMinedPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { SmallBlock } from 'ethvm-models'
import { Events } from '@app/server/core/events'

const getBlocksMinedEvent: SocketEvent = {
  id: 'ggg', // new_name: get-blocks-mined
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockMinedPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<SmallBlock[]> =>
    server.blockService.getBlocksMined(payload.address, payload.limit, payload.page)
}
export default getBlocksMinedEvent
