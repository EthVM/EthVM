/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestAvgTxFees
// ====================================================

export interface latestAvgTxFees_blockMetrics_items {
  __typename: "BlockMetric";
  blockHash: string;
  number: any;
  avgTxFees: any;
}

export interface latestAvgTxFees_blockMetrics {
  __typename: "BlockMetricsPage";
  items: latestAvgTxFees_blockMetrics_items[];
}

export interface latestAvgTxFees {
  blockMetrics: latestAvgTxFees_blockMetrics;
}

export interface latestAvgTxFeesVariables {
  limit?: number | null;
}
