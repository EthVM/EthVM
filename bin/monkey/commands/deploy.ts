import { sendContract, waitOnConfirmation } from '../shared'
import { getContractAddressCommand } from './contract-address'

export async function deployContractCommand(fromAddress: string, type: string) {
  const txhash = await sendContract(fromAddress, type)
  await waitOnConfirmation(txhash)
  await getContractAddressCommand(txhash)
}
