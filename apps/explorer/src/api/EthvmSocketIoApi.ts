import { Account, Block, Events, PendingTx, Statistic, Tx, Uncle } from 'ethvm-common'
import io from 'socket.io-client'
import { EthvmApi } from '@app/api'

export class EthvmSocketIoApi implements EthvmApi {
  private readonly io: SocketIOClient.Socket

  constructor(readonly endpoint: string) {
    this.io = io(endpoint)
  }

  // Blocks
  getBlocks(limit: number, page: number): Promise<Block[]> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.pastBlocks,
        {
          limit,
          page
        },
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        }
      )
    })
  }

  getBlock(hash: string): Promise<Block | null> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getBlock,
        {
          hash: hash.replace('0x', '')
        },
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        }
      )
    })
  }

  getBlockByNumber(no: number): Promise<Block | null> {
    return Promise.resolve(null)
  }

  getBlocksMined(address: string, limit: number, page: number): Promise<Block[]> {
    return Promise.resolve([])
  }

  // Uncles
  getUncles(limit: number, page: number): Promise<Uncle[]> {
    throw new Error('Method not implemented.')
  }

  getUncle(hash: string): Promise<Uncle | null> {
    throw new Error('Method not implemented.')
  }

  // Txs
  getTx(hash: string): Promise<Tx | null> {
    return new Promise((reject, resolve) => {
      this.io.emit(
        Events.getTx,
        {
          hash: hash.replace('0x', '')
        },
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        }
      )
    })
  }

  getTxs(limit: number, page: number): Promise<Tx[]> {
    return new Promise((reject, resolve) => {
      this.io.emit(
        Events.pastTxs,
        {
          limit,
          page
        },
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        }
      )
    })
  }

  getBlockTxs(hash: string): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  getTxsOfAddress(hash: string, limit: number, page: number): Promise<Tx[]> {
    return new Promise((reject, resolve) => {
      this.io.emit(
        Events.getAddressTxs,
        {
          address: hash.replace('0x', ''),
          limit,
          page
        },
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        }
      )
    })
  }

  // Pending Txs
  getPendingTxs(limit: number, page: number): Promise<PendingTx[]> {
    throw new Error('Method not implemented.')
  }

  getPendingTxsOfAddress(hash: string, limit: number, page: number): Promise<PendingTx[]> {
    throw new Error('Method not implemented.')
  }

  // Statistics
  getAverageTotalDifficulty(start: Date, end: Date): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  getAverageGasPrice(start: Date, end: Date): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  getAverageTxFee(start: Date, end: Date): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  getAverageSuccessfullTx(start: Date, end: Date): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  getAverageFailedTx(start: Date, end: Date): Promise<Statistic[]> {
    throw new Error('Method not implemented.')
  }

  // Accounts
  getAccount(hash: string): Promise<Account | null> {
    return new Promise((reject, resolve) => {
      this.io.emit(
        Events.getAccount,
        {
          address: hash.replace('0x', '')
        },
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        }
      )
    })
  }

  getAccountTxs(hash: string, limit: number = 0, page: number = 0): Promise<Tx[]> {
    throw new Error('Method not implemented.')
  }

  getAccountTotalTxs(hash: string): Promise<number> {
    throw new Error('Method not implemented.')
  }

  // Search
  search(input: string): Promise<any> {
    return new Promise((reject, resolve) => {
      this.io.emit(
        Events.search,
        {
          hash: input
        },
        (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        }
      )
    })
  }
}
