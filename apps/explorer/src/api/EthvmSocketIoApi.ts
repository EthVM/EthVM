import { Block } from 'ethvm-common'
import io from 'socket.io-client'
import { EthvmApi } from '@app/api'

export class EthvmSocketIoApi implements EthvmApi {
  private readonly io: SocketIOClient.Socket

  constructor(readonly endpoint: string) {
    this.io = io(endpoint)
  }

  getBlocks(limit: number, page: number): Promise<Block[]> {
    return Promise.resolve([])
  }

  getBlock(hash: string): Promise<Block | null> {
    return Promise.resolve(null)
  }

  getBlockByNumber(no: number): Promise<Block | null> {
    return Promise.resolve(null)
  }

  getBlocksMined(address: string, limit: number, page: number): Promise<Block[]> {
    return Promise.resolve([])
  }
}
