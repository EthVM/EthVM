import BigNumber from 'bignumber.js'
import * as abi from 'ethereumjs-abi'
import { Token } from 'ethvm-common'
import fetch from 'node-fetch'
import * as utils from 'web3-utils'

export interface VmEngineOptions {
  rpcUrl: string
  tokensAddress: Contract
}

export interface Contract {
  address: string
}

export class VmEngine {

  constructor(private readonly opts: VmEngineOptions) {
  }

  public async getAddressAllTokensOwned(address: string): Promise<Token[]> {
    address = address.startsWith('0x') ? address : '0x' + address

    const method = 'getAllBalance'
    const keys = [
      'address', // Address we are checking tokens for
      'bool',    // decode name
      'bool',    // decode website
      'bool',    // decode email
      'uint256'  // num of tokens to retrieve (0: all)
    ]
    const values = [address, true, false, false, 0]
    const encoded = this.encodeCall(method, keys, values)

    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: 'eth_call',
      params: [{ to: this.opts.tokensAddress.address, data: encoded }, 'latest']
    }

    return fetch(
      this.opts.rpcUrl,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      }
    )
    .then(res => res.json())
    .then(json => this.decode(json.result))
    .then(tokens => tokens.filter(t => t.balance && t.balance !== '0'))
    .catch(e => [])
  }

  public async getAddressAmountTokensOwned(address: string): Promise<number> {
    const tokens = await this.getAddressAllTokensOwned(address)
    return Promise.resolve(tokens.length)
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
      offset -= sizeHex(1)

      token.decimals = new BigNumber('0x' + hex.substr(offset, sizeHex(1))).toNumber()
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
