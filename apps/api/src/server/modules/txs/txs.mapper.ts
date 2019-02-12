import { InternalTx, Tx, TxReceipt } from 'ethvm-common'

const toInternalTx = (tx: any): InternalTx => {
  if (tx.nonce) {
    tx.nonce = tx.nonce.toString()
  }
  if (tx.value) {
    tx.value = tx.value.toString()
  }
  if (tx.gasPrice) {
    tx.gasPrice = tx.gasPrice.toString()
  }
  if (tx.gas) {
    tx.gas = tx.gas.toString()
  }
  return tx
}

const toTxReceipt = (receipt: any): TxReceipt => {
  if (receipt.cumulativeGasUsed) {
    receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString()
  }
  if (receipt.gasUsed) {
    receipt.gasUsed = receipt.gasUsed.toString()
  }
  if (receipt.internalTxs) {
    receipt.internalTxs = receipt.internalTxs.map(itx => toInternalTx(itx))
  }
  return receipt
}

const toTx = (tx: any): Tx => {
  tx.nonce = tx.nonce.toString()
  tx.gasPrice = tx.gasPrice.toString()
  tx.gas = tx.gas.toString()
  tx.v = tx.v.toString()
  tx.value = tx.value.toString()
  tx.blockNumber = tx.blockNumber ? tx.blockNumber.toString() : '0' // Temporary fix
  tx.receipt = toTxReceipt(tx.receipt)

  return tx
}

export { toTx }
