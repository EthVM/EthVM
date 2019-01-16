import { Tx } from 'ethvm-common'

const toTx = (tx: any): Tx => {
  tx.nonce = tx.nonce.toString()
  tx.gasPrice = tx.gasPrice.toString()
  tx.gas = tx.gas.toString()
  tx.v = tx.v.toString()
  tx.value = tx.value.toString()

  return tx
}

export { toTx }
