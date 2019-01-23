import { blockMinedPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, Block } from 'ethvm-common'

const getBlocksMinedEvent: SocketEvent = {
  id: Events.getBlocksMined,
  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = blockMinedPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Block[]> =>
    server.blockService.getBlocksMined(payload.address, payload.limit, payload.page)
}
export default getBlocksMinedEvent
