import { waitOnConfirmation } from '../shared'

export async function waitForConfirmationCommand(txhash: string) {
  await waitOnConfirmation(txhash)
}
