import { bufferToHex, generateAddress, toBuffer } from 'ethereumjs-util'
import { client, ora } from '../shared'

export async function getContractAddressCommand(txhash: string) {
  ora.start(`Getting contract address...`)

  const detail = await client.callAsync('eth_getTransactionByHash', [txhash])

  if (detail.blockNumber == null) {
    ora.warn(`Contract tx has not yet been confirmed.`)
  } else {
    const ca = generateAddress(toBuffer(detail.from), toBuffer(detail.nonce))
    const caStr = bufferToHex(ca)
    ora.succeed(`Contract address is: ${caStr}`)
  }
}
