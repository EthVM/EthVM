import { ChartPayload } from '@app/server/core/payloads'
import { toDatePeriods } from '@app/server/core/utils'
import { chartPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'

const getChartsDataEvent: SocketEvent = {
  id: 'getChartGasLimit', // new_name: chart_gas_limit

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = chartPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: ChartPayload): Promise<any> => {
    const period = toDatePeriods(payload.duration)
    return server.chartsService.getGasLimit(period.from, period.to)
  }
}

export default getChartsDataEvent
