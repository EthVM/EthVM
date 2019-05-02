/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestBlockMetrics
// ====================================================

export interface latestBlockMetrics_blockMetrics_items {
  __typename: "BlockMetric";
  number: any;
  blockHash: string | null;
  timestamp: number | null;
  blockTime: number | null;
  numUncles: number | null;
  difficulty: any | null;
  totalDifficulty: any | null;
  totalGasPrice: any | null;
  avgGasLimit: any | null;
  avgGasPrice: any | null;
  totalTxs: number | null;
  numSuccessfulTxs: number | null;
  numFailedTxs: number | null;
  numInternalTxs: number | null;
  totalTxFees: any | null;
  avgTxFees: any | null;
}

export interface latestBlockMetrics_blockMetrics {
  __typename: "BlockMetricPage";
  items: (latestBlockMetrics_blockMetrics_items | null)[] | null;
}

export interface latestBlockMetrics {
  blockMetrics: latestBlockMetrics_blockMetrics;
}

export interface latestBlockMetricsVariables {
  limit?: number | null;
}
