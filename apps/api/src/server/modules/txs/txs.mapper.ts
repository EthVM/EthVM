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

const toTx = (tx: any, format: string = 'full'): Tx => {
  switch (format) {
    case 'full':
      return toFullTx(tx)
    case 'simple':
      return toSimpleTx(tx)
    default:
      throw new Error('Illegal format passed to mapper!')
  }
}

const toFullTx = (tx: any): Tx => {
  tx.nonce = tx.nonce.toString()
  tx.gasPrice = tx.gasPrice.toString()
  tx.gas = tx.gas.toString()
  tx.v = tx.v.toString()
  tx.value = tx.value.toString()
  tx.blockNumber = tx.blockNumber ? tx.blockNumber.toString() : '0' // Temporary fix
  tx.receipt = toTxReceipt(tx.receipt)

  return tx
}

const toSimpleTx = (tx: any): Tx => {
  const sTx : any = {}
  sTx.hash = tx.hash
  sTx.from = tx.from
  sTx.to = tx.to
  sTx.gas = tx.gas
  sTx.gasPrice = tx.gasPrice
  sTx.timestamp = tx.timestamp
  sTx.value = tx.value.toString()
  sTx.blockNumber = tx.blockNumber ? tx.blockNumber.toString() : '0' // Temporary fix
  sTx.blockHash = tx.blockHash
  sTx.receipt = toTxReceipt(tx.receipt)
  return sTx
}

export { toTx, toSimpleTx }
