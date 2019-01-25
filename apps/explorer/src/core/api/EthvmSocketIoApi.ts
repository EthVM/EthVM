import { AddressBalance, Block, Events, PendingTx, Statistic, Tx, Uncle } from 'ethvm-common'
import io from 'socket.io-client'
import { EthvmApi } from '@app/core/api'

export class EthvmSocketIoApi implements EthvmApi {
  private readonly io: SocketIOClient.Socket

  constructor(readonly endpoint: string) {
    this.io = io(endpoint)
  }

  // Balances
  getAddressBalance(hash: string): Promise<AddressBalance | null> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getAddressBalance,
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

  // Blocks
  getBlocks(limit: number = 100, page: number = 0): Promise<Block[]> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getBlocks,
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
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getBlockByNumber,
        {
          no
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

  getBlocksMined(address: string, limit: number = 100, page: number = 0): Promise<Block[]> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getBlocksMined,
        {
          address: address.replace('0x', ''),
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

  // Uncles
  getUncles(limit: number = 100, page: number = 0): Promise<Uncle[]> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getUncles,
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

  getUncle(hash: string): Promise<Uncle | null> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getUncle,
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

  // Txs
  getTx(hash: string): Promise<Tx | null> {
    return new Promise((resolve, reject) => {
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

  getTxs(limit: number = 100, page: number = 0): Promise<Tx[]> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getTxs,
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
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getBlockTxs,
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

  getTxsOfAddress(hash: string, limit: number = 100, page: number = 0): Promise<Tx[]> {
    return new Promise((resolve, reject) => {
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

  getAddressTotalTxs(hash: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getAddressTotalTxs,
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

  // Pending Txs
  getPendingTxs(limit: number = 100, page: number = 0): Promise<PendingTx[]> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getPendingTxs,
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

  getPendingTxsOfAddress(hash: string, limit: number = 100, page: number = 0): Promise<PendingTx[]> {
    return new Promise((resolve, reject) => {
      this.io.emit(
        Events.getPendingTxsOfAddress,
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

  // Search
  search(input: string): Promise<any> {
    return new Promise((resolve, reject) => {
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
