/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestLiveTxFees
// ====================================================

export interface latestLiveTxFees_blockMetricsTransaction_items {
  __typename: "BlockMetricsTransaction";
  blockHash: string;
  number: any;
  avgGasPrice: any;
}

export interface latestLiveTxFees_blockMetricsTransaction {
  __typename: "BlockMetricsTransactionPage";
  items: latestLiveTxFees_blockMetricsTransaction_items[];
}

export interface latestLiveTxFees_blockMetricsTransactionFee_items {
  __typename: "BlockMetricsTransactionFee";
  blockHash: string;
  number: any;
  avgTxFees: any;
}

export interface latestLiveTxFees_blockMetricsTransactionFee {
  __typename: "BlockMetricsTransactionFeePage";
  items: latestLiveTxFees_blockMetricsTransactionFee_items[];
}

export interface latestLiveTxFees {
  blockMetricsTransaction: latestLiveTxFees_blockMetricsTransaction;
  blockMetricsTransactionFee: latestLiveTxFees_blockMetricsTransactionFee;
}

export interface latestLiveTxFeesVariables {
  limit?: number | null;
}
