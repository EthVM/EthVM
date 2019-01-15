import { Tx } from 'ethvm-common'

const toTx = (tx: any): Tx => {
  tx.nonce = tx.nonce.bytes
  tx.gasPrice = tx.gasPrice.bytes
  tx.gas = tx.gas.bytes
  tx.v = tx.v.bytes
  if (tx.value) {
    tx.value = tx.value.bytes
  }

  return tx
}

export { toTx }
