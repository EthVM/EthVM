import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { BlockMetrics, Events } from 'ethvm-common'

const getBlockMetrics: SocketEvent = {
  id: Events.getBlockMetrics,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<BlockMetrics[]> =>
    server.blockMetricsService.getBlockMetrics(payload.limit, payload.page)
}

export default getBlockMetrics
