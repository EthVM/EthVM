/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestAvgTxFees
// ====================================================

export interface latestAvgTxFees_blockMetricsTransactionFee_items {
  __typename: "BlockMetricsTransactionFee";
  blockHash: string;
  number: any;
  avgTxFees: any;
}

export interface latestAvgTxFees_blockMetricsTransactionFee {
  __typename: "BlockMetricsTransactionFeePage";
  items: latestAvgTxFees_blockMetricsTransactionFee_items[];
}

export interface latestAvgTxFees {
  blockMetricsTransactionFee: latestAvgTxFees_blockMetricsTransactionFee;
}

export interface latestAvgTxFeesVariables {
  limit?: number | null;
}
