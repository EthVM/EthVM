import { removePrefix } from '@app/server/core/utils'
import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { BlockMetrics, Events } from 'ethvm-common'

const getBlockMetric: SocketEvent = {
  id: Events.getBlockMetric,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<BlockMetrics | null> =>
    server.blockMetricsService.getBlockMetric(removePrefix(payload.hash))
}

export default getBlockMetric
