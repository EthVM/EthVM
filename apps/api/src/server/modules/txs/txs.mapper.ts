import { Tx, TxReceipt } from 'ethvm-common'

const toTxReceipt = (receipt: any): TxReceipt => {
  if (receipt.cumulativeGasUsed) {
    receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString()
  }
  if (receipt.gasUsed) {
    receipt.gasUsed = receipt.gasUsed.toString()
  }
  return receipt
}

const toTx = (tx: any): Tx => {
  tx.nonce = tx.nonce.toString()
  tx.gasPrice = tx.gasPrice.toString()
  tx.gas = tx.gas.toString()
  tx.v = tx.v.toString()
  tx.value = tx.value.toString()
  tx.blockNumber = tx.blockNumber.toString()
  tx.receipt = toTxReceipt(tx.receipt)

  return tx
}

export { toTx }
