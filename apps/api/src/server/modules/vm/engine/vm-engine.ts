import { Token } from '@app/server/modules/token'
import BigNumber from 'bignumber.js'
import * as abi from 'ethereumjs-abi'
import * as jayson from 'jayson/promise'
import * as utils from 'web3-utils'

export interface VmEngineOptions {
  rpcUrl: string
  tokensAddress: Contract
  account: string
}

export interface Contract {
  address: string
}

export class VmEngine {
  private readonly client: jayson.Client

  constructor(private readonly opts: VmEngineOptions) {
    this.client = jayson.Client.https(this.opts.rpcUrl)
  }

  public getAccount(): Promise<any> {
    return this.client.request('eth_getKeyValue', [this.opts.account])
  }

  public getBalance(address: string): Promise<any> {
    return this.client.request('eth_getBalance', [address, 'latest'])
  }

  public getTokens(address: string): Promise<Token[]> {
    return new Promise(async (resolve, reject) => {
      const argss = ['address', 'uint32', 'uint32']
      const vals = [address, 4, 0]

      const encoded = this.encodeCall('getAllBalance', argss, vals)

      try {
        const payload = [{ to: this.opts.tokensAddress.address, data: encoded }, 'latest']

        const response = await this.client.request('eth_call', payload)

        const tokens = this.decode(response.result || [])
        resolve(tokens)
      } catch (err) {
        reject(err)
      }
    })
  }

  private encodeCall(name: string, args: string[] = [], rawValues: any[] = []): string {
    const values = rawValues.map(value => value.toString())
    const methodId = abi.methodID(name, args).toString('hex')
    const params = abi.rawEncode(args, values).toString('hex')
    return '0x' + methodId + params
  }

  private decode(hex: string): Token[] {
    const tokens: Token[] = []

    const sizeHex = bytes => bytes * 2
    const trim = (str: string): string => str.replace(/\0[\s\S]*$/g, '')

    const getAscii = (h: string): string => {
      h = h.substring(0, 2) === '0x' ? h : '0x' + h
      return trim(utils.toAscii(h))
    }

    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex
    hex = hex.substring(0, hex.lastIndexOf('1') - 1) // starting point

    let offset = hex.length
    offset -= sizeHex(32)

    const countTokens = hex.substr(offset, sizeHex(32))
    offset -= sizeHex(1)

    const isName = parseInt(hex.substr(offset, sizeHex(1)))
    offset -= sizeHex(1)

    const isWebSite = parseInt(hex.substr(offset, sizeHex(1)))
    offset -= sizeHex(1)

    const isEmail = parseInt(hex.substr(offset, sizeHex(1)))
    const numTokens = new BigNumber('0x' + countTokens).toNumber()

    for (let i = 0; i < numTokens; i++) {
      const token: any = {}

      offset -= sizeHex(16)

      token.symbol = getAscii(hex.substr(offset, sizeHex(16)))
      offset -= sizeHex(20)

      token.addr = '0x' + hex.substr(offset, sizeHex(20))
      offset -= sizeHex(8)

      token.decimals = new BigNumber('0x' + hex.substr(offset, sizeHex(8))).toNumber()
      offset -= sizeHex(32)

      token.balance = new BigNumber('0x' + hex.substr(offset, sizeHex(32))).toFixed()

      if (isName) {
        offset -= sizeHex(16)
        token.name = getAscii(hex.substr(offset, sizeHex(16)))
      }

      if (isWebSite) {
        offset -= sizeHex(32)
        token.website = getAscii(hex.substr(offset, sizeHex(32)))
      }

      if (isEmail) {
        offset -= sizeHex(32)
        token.email = getAscii(hex.substr(offset, sizeHex(32)))
      }

      tokens.push(token)
    }

    return tokens
  }
}
