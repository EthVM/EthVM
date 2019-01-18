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

  // Addresses
  getAddressBalance: "get-address-balance",
  getAddressTokenBalance: "get-address-token-balance",
  getAddressTokenTransfers: "get-address-token-transfers",

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
  getAddressTotalTxs: "get-address-total-txs",

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
  getTokenBalance: "get-tokens-balance",

  // Search
  search: "search",

  // Stats
  getAverageTotalDifficultyStats: "get-average-difficulty-stats",
  getAverageGasPriceStats: "get-average-gas-price-stats",
  getAverageTxFeeStats: "get-average-tx-fee-stats",
  getAverageSuccessfullTxStats: "get-average-successfull-tx-stats",
  getAverageFailedTxStats: "get-average-failedtx-stats",
  getAverageBlockSizeStats: "get-average-block-size-stats",
  getAverageBlockTimeStats: "get-average-block-time-stats",
  getAverageNumberOfUnclesStats: "get-average-number-of-uncles",
  getAverageHashRateStats: "get-average-hash-rate-stats",
  getAverageMinerRewardsStats: "get-average-miner-rewards-stats",
  getAverageTotalTxs: "get-average-total-txs-stats"
}

export const SocketDefaultRooms = ["blocks", "txs", "uncles", "pendingTxs"]
