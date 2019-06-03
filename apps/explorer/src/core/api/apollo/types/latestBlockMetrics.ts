/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestBlockMetrics
// ====================================================

export interface latestBlockMetrics_blockMetrics_items {
  __typename: "BlockMetric";
  number: any;
  blockHash: string;
  timestamp: any;
  blockTime: number;
  numUncles: number;
  difficulty: any;
  totalDifficulty: any;
  totalGasPrice: any;
  avgGasLimit: any;
  avgGasPrice: any;
  totalTxs: number;
  numSuccessfulTxs: number;
  numFailedTxs: number;
  numInternalTxs: number;
  totalTxFees: any;
  avgTxFees: any;
}

export interface latestBlockMetrics_blockMetrics {
  __typename: "BlockMetricPage";
  items: latestBlockMetrics_blockMetrics_items[];
  offset: number;
  limit: number;
  totalCount: number;
}

export interface latestBlockMetrics {
  blockMetrics: latestBlockMetrics_blockMetrics;
}

export interface latestBlockMetricsVariables {
  limit?: number | null;
}
