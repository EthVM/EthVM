import { PendingTx } from '@app/core/models'

const dedup = (tx: PendingTx, pTxs: PendingTx[]): PendingTx[] => {
  for (let i = 0; i < pTxs.length; i++) {
    if (tx.getId() === pTxs[i].getId()) {
      pTxs.splice(i, 1)
    }
  }
  return pTxs
}

export const processPendingTxs = (tx: PendingTx, pTxs: PendingTx[]): PendingTx[] => {
  const txs = dedup(tx, pTxs)
  txs.push(tx)
  return txs
}
