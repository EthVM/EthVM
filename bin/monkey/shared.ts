import * as rpc from '@enkrypt.io/json-rpc2'
import assert from 'assert'
import EthereumTx from 'ethereumjs-tx'
import Ora from 'ora'
import * as Util from 'util'
import * as utils from 'web3-utils'
import accountsData from './accounts.json'
import contracts from './contracts.json'

export const client = rpc.Client.$create(8545, 'localhost')
client.callAsync = Util.promisify(client.call)

export const ora = new Ora({
  color: 'yellow'
})

export interface TxParams {
  from?: string
  to?: string
  nonce?: string
  gas?: string
  data?: any
  gasPrice?: string
  value?: string
}

export interface ContractDefinition {
  name: string
  data: string
  abi: any
}

export async function sendTransaction(params: TxParams, privateKey?: string): Promise<string> {
  const { from, to, value, gas } = params

  const pending = await client.callAsync('eth_getTransactionCount', [from, 'pending'])
  const nonce = '0x' + parseInt(pending).toString(16)

  const tx = new EthereumTx({ ...params, nonce })

  if (from && privateKey) {
    tx.sign(Buffer.from(privateKey, 'hex'))
  }

  const serializedTx = '0x' + tx.serialize().toString('hex')

  ora.start(`Sending transaction, value: '${value}' to: '${to}' from: '${from}' gas: '${gas}' nonce: '${nonce}' ...`)

  try {
    const hash = await client.callAsync('eth_sendRawTransaction', [serializedTx])
    ora.succeed(`Transaction sent, txhash: ${hash}`)
    return hash
  } catch (e) {
    ora.fail(`Failed to send transaction, reason = ${e.message}`)
    throw e
  }
}

export async function estimateGas(txParams: TxParams): Promise<string> {
  const estimate = await client.callAsync('eth_estimateGas', [txParams])
  let wei = utils.hexToNumber(estimate)
  wei += Math.ceil(wei * 0.015)
  return utils.numberToHex(wei)
}

export async function sendContract(fromAddress: string, type: string = 'erc20'): Promise<string> {
  const privateKey = privateKeyForAddress(fromAddress)
  const contract = contractForType(type)
  const { data } = contract

  const params: TxParams = {
    to: '',
    value: '',
    from: fromAddress,
    data,
    gasPrice: '0x430E23400'
  }

  params.gas = await estimateGas({ data })

  return await sendTransaction(params, privateKey)
}

export async function waitOnConfirmation(txhash: string, timeoutSeconds: number = 120): Promise<void> {
  ora.start(`Waiting up to ${timeoutSeconds} seconds for tx confirmation...`)

  const intervalMs = 5 * 1000
  const startMs = new Date().getTime()
  let elapsedSeconds = 0

  return new Promise<void>((resolve, reject) => {
    async function checkStatus() {
      const detail = await client.callAsync('eth_getTransactionByHash', [txhash])

      if (detail.blockNumber) {
        ora.succeed(`Confirmation received, block number = ${utils.hexToNumber(detail.blockNumber)}`)
        resolve(detail)
      } else {
        elapsedSeconds = (new Date().getTime() - startMs) / 1000
        if (elapsedSeconds > timeoutSeconds) {
          ora.fail('Timed out waiting for tx confirmation')
          reject(new Error('Timeout whist waiting'))
        }
        setTimeout(checkStatus, intervalMs)
      }
    }

    checkStatus()
  })
}

export function contractForType(type: string): ContractDefinition {
  const filtered = Object.keys(contracts).filter(key => key === type)
  assert(filtered.length === 1, `Contract definition not found: ${type}`)
  return contracts[type] as ContractDefinition
}

export function privateKeyForAddress(address: string): string {
  const filtered = accountsData.accounts.filter(a => a.address === address).map(a => a.key)
  assert(filtered.length === 1, `Private key not found for address: ${address}`)
  return filtered[0]
}
