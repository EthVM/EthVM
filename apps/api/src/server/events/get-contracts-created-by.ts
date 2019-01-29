import { removePrefix } from '@app/server/core/utils'
import { contractSchemaPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Contract, Events } from 'ethvm-common'

const getContractsCreatedByEvent: SocketEvent = {
  id: Events.getContractsCreatedBy,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = contractSchemaPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<Contract[]> =>
    server.contractsService.getContractsCreatedBy(removePrefix(payload.address), payload.limit, payload.page)
}

export default getContractsCreatedByEvent
