import { simpleEncode } from 'ethereumjs-abi'
import { bufferToHex } from 'ethereumjs-util'
import { estimateGas, ora, privateKeyForAddress, sendTransaction, TxParams } from '../shared'

export async function contractExecCommand(contractAddress: string, fromAddress: string, method: string, ...args: any[]) {
  ora.info(`Executing erc20 method - ca: '${contractAddress}' | method: '${method}' | args: '${args.join(', ')}'`)

  const privateKey = privateKeyForAddress(fromAddress)

  const params: TxParams = {
    to: contractAddress,
    from: fromAddress,
    gasPrice: '0x430E23400',
    data: bufferToHex(simpleEncode(method, ...args))
  }

  params.gas = await estimateGas(params)

  console.log('Gas estimated', params.gas)

  await sendTransaction(params, privateKey)
}
