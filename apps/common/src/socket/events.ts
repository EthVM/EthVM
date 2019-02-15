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
  NEW_BLOCK: "NEW_BLOCK",
  NEW_PENDING_TX: "NEW_PENDING_TX",
  NEW_BLOCK_METRIC: "NEW_BLOCK_METRIC",
  NEW_PROCESSING_METADATA: 'NEW_PROCESSING_METADATA',

  NEW_TX: "NEW_TX",
  NEW_UNCLE: "NEW_UNCLE",

  // Addresses
  getAddressBalance: "get-address-balance",
  getAddressTokenBalance: "get-address-token-balance",
  getAddressTokenTransfers: "get-address-token-transfers",
  getAddressTokenTransfersByHolder: "get-address-token-transfers-by-holder",
  getAddressAmountTokensOwned: "get-address-amount-tokens-owned",
  getAddressMetadata: "get-address-metadata",
  getAddressAllTokensOwned: "get-address-all-tokens-owned",

  // Contracts
  getContract: "get-contract",
  getContractsCreatedBy: "getContractsCreatedBy",

  // Blocks
  getBlock: "get-block",
  getBlocks: "get-blocks",
  getBlocksMined: "get-blocks-mined",
  getBlockByNumber: "get-block-by-number",
  getTotalNumberOfBlocks: "get-total-number-of-blocks",

  // Blocks Metrics
  getBlockMetric: "get-block-metric",
  getBlockMetrics: "get-block-metrics",

  // Txs
  getTx: "get-tx",
  getTxs: "get-txs",
  getBlockTxs: "get-block-txs",
  getAddressTxs: "get-address-txs",
  getTotalNumberOfTxs: "get-total-number-of-txs",

  // PendingTxs
  getPendingTxs:"get-pending-txs",
  getPendingTxsOfAddress: "get-address-pending-txs",
  getTotalNumberOfPendingTxs: "get-total-number-of-pending-txs",
  getNumberOfPendingTxsOfAddress: "get-number-of-pending-txs-of-address",

  // Uncles
  getUncle:"get-uncle",
  getUncles:"get-uncles",
  getTotalNumberOfUncles: "get-total-number-of-uncles",

  // Exchange
  getExchangeRates: "get-exchange-rates",
  getTokenExchangeRates: "get-token-exchange-rates",
  getTokenExchangeRateBySymbol: "get-token-exchange-rate-by-symbol",
  getTokenExchangeRateByAddress: "get-token-exchange-rate-by-address",

  // Search
  search: "search",

  // Stats
  getAverageDifficultyStats: "get-average-difficulty-stats",
  getAverageGasLimitStats: "get-average-gas-limit-stats",
  getAverageGasPriceStats: "get-average-gas-price-stats",
  getAverageTxFeeStats: "get-average-tx-fee-stats",
  getSuccessfulTxStats: "get-successful-tx-stats",
  getFailedTxStats: "get-failed-tx-stats",
  getTxStats: "get-tx-stats",
  getAverageBlockSizeStats: "get-average-block-size-stats",
  getAverageBlockTimeStats: "get-average-block-time-stats",
  getAverageNumberOfUnclesStats: "get-average-number-of-uncles",
  getAverageHashRateStats: "get-average-hash-rate-stats",
  getAverageMinerRewardsStats: "get-average-miner-rewards-stats",

  // Processing Metadata
  getProcessingMetadata: "get-processing-metadata"
}

export const SocketRooms = {
  DefaultRooms: ["blocks", "pending-txs", "block-metrics", "processing-metadata"],
  Blocks: 'blocks',
  PendingTxs: 'pending-txs',
  BlockMetrics: 'block-metrics',
  ProcessingMetadata: 'processing-metadata'
}
