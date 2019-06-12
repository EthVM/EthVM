/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newAvgTxFee
// ====================================================

export interface newAvgTxFee_newBlockMetricsTransactionFee {
  __typename: "BlockMetricsTransactionFee";
  blockHash: string;
  number: any;
  avgTxFees: any;
}

export interface newAvgTxFee {
  newBlockMetricsTransactionFee: newAvgTxFee_newBlockMetricsTransactionFee;
}
