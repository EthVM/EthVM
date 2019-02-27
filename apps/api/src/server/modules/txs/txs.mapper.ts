import { Trace, Tx, TxReceipt } from 'ethvm-common'

const toTrace = (trace: any): Trace => {
  return trace
}

const toTxReceipt = (receipt: any): TxReceipt => {
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
  return tx
}

const toSimpleTx = (tx: any): Tx => {
  const sTx : any = {}
  sTx.blockNumber = tx.blockNumber
  sTx.blockHash = tx.blockHash
  sTx.hash = tx.hash
  sTx.from = tx.from
  sTx.to = tx.to
  sTx.gas = tx.gas
  sTx.gasPrice = tx.gasPrice
  sTx.timestamp = tx.timestamp
  sTx.value = tx.value
  sTx.receipt = tx.receipt
  return sTx
}

export { toTx, toSimpleTx }
