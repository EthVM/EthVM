import { simpleEncode } from 'ethereumjs-abi'
import { bufferToHex } from 'ethereumjs-util'
import { estimateGas, ora, privateKeyForAddress, sendTransaction, TxParams } from '../shared'

export async function contractExecCommand(contractAddress: string, fromAddress: string, method: string, ...args: any[]) {
  ora.succeed(`Executing method - Method: '${method}' | Method args: '${args.join(', ')}' | From address: '${fromAddress}' | To: '${contractAddress}'`)

  const privateKey = privateKeyForAddress(fromAddress)
  const params: TxParams = {
    to: contractAddress,
    from: fromAddress,
    gasPrice: '0x430E23400',
    data: bufferToHex(simpleEncode(method, ...args))
  }
  params.gas = await estimateGas(params)
  ora.info(`Gas estimated: ${params.gas}`)

  await sendTransaction(params, privateKey)
}
