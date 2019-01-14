export interface SocketEvent {
  op: 'insert' | 'delete' | 'replace' | 'updated' | 'invalidate'
  key: any
  value: any
}

export const Events = {
  // Generic
  join: "join",
  leave: "leave",

  // Ouputs
  newTx: "NEW_TX",
  newPendingTx: "NEW_PENDING_TX",
  newBlock: "NEW_BLOCK",
  newUncle:"NEW_UNCLE",
  pastTxsR: "PAST_TXS_RECEIVED",
  pastBlocksR: "PAST_BLOCKS_RECEIVED",

  // Accounts
  getAccount: "get-account",
  getAccountTotalTxs: "get-total-txs",

  // Blocks
  getBlock: "get-block",
  getBlocks: "get-blocks",
  getBlocksMined: "get-blocks-mined",
  getBlockByNumber: "get-block-by-number",

  // Txs
  getTx: "get-tx",
  getTxs: "get-txs",
  getBlockTxs: "get-block-txs",
  getAddressTxs: "get-address-txs",

  // PendingTxs
  getPendingTxs:"get-pending-txs",
  getPendingTxsOfAddress: "get-address-pending-txs",

  // Uncles
  getUncle:"get-uncle",
  getUncles:"get-uncles",

  // Exchange
  getExchangeRates: "get-exchange-rates",

  // Vm
  getCurrentStateRoot: "get-current-state-root",
  getBalance: "get-balance",
  getTokenBalance: "get-tokens-balance",
  ethCall:"eth-call",

  // Search
  search: "search",

  // Stats
  getAvgTotalDifficultyStats: "get-average-difficulty-stats",
  getAvgGasPriceStats: "get-average-gas-price-stats",
  getAvgTxFeeStats: "get-average-tx-fee-stats",
  getAvgSuccessfullTxStats: "get-average-successfull-tx-stats",
  getAvgFailedTxStats: "get-average-successfull-tx-stats"
}

export const SocketDefaultRooms = ["blocks", "txs", "uncles", "pendingTxs"]
