import { genericPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, ProcessingMetadata } from 'ethvm-common'

const getProcessingMetadata: SocketEvent = {
  id: Events.getProcessingMetadata,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = genericPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any): Promise<ProcessingMetadata | null> =>
    server.processingMetadataService.getMetadata(payload.id)
}

export default getProcessingMetadata
