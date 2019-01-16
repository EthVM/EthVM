import { Tx } from 'ethvm-common'

const toTx = (tx: any): Tx => {
  tx.nonce = Buffer.from(tx.nonce.bytes)
  tx.gasPrice = Buffer.from(tx.gasPrice.bytes)
  tx.gas = Buffer.from(tx.gas.bytes)
  tx.v = Buffer.from(tx.v.bytes)
  if (tx.value) {
    tx.value = Buffer.from(tx.value.bytes)
  }

  return tx
}

export { toTx }
