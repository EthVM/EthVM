import { TokenTransferPayload } from '@app/server/core/payloads'
import { tokenTransferPayloadValidator } from '@app/server/core/validation'
import { EthVMServer, SocketEvent, SocketEventValidationResult } from '@app/server/ethvm-server'
import { Events, TokenTransfer } from 'ethvm-common'

const getBalanceEvent: SocketEvent = {
  id: Events.getAddressTokenTransfers,

  onValidate: (server: EthVMServer, socket: SocketIO.Socket, payload: any): SocketEventValidationResult => {
    const valid = tokenTransferPayloadValidator(payload) as boolean
    return {
      valid,
      errors: [] // TODO: Map properly the error
    }
  },

  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: TokenTransferPayload): Promise<TokenTransfer[]> =>
    server.tokensService.getAddressTokenTransfers(payload.address, payload.limit, payload.page)
}

export default getBalanceEvent
