import { PendingTx } from 'ethvm-models'

const toPendingTx = (tx: any): PendingTx => {
  const t: any = {}
  if (tx.hash) {
    t.hash = tx.hash
  }
  if (tx.nonce) {
    t.nonce = tx.nonce
  }
  if (tx.from) {
    t.from = tx.from
  }
  if (tx.to) {
    t.to = tx.to
  }
  if (tx.contractAddress) {
    t.contractAddress = tx.contractAddress
  }
  if (tx.gasPrice) {
    t.gasPrice = tx.gasPrice.buffer
  }
  if (tx.gasLimit) {
    t.gasLimit = tx.gasLimit.buffer
  }
  if (tx.v) {
    t.v = tx.v
  }
  if (tx.r) {
    t.r = tx.r.buffer
  }
  if (tx.s) {
    t.s = tx.s.buffer
  }
  if (tx.value) {
    t.value = tx.value.buffer
  }
  return t
}

export { toPendingTx }
