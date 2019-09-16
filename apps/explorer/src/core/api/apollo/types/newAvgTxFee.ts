/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newAvgTxFee
// ====================================================

export interface newAvgTxFee_newBlockMetric {
  __typename: "BlockMetric";
  blockHash: string;
  number: any;
  avgTxFees: any;
}

export interface newAvgTxFee {
  newBlockMetric: newAvgTxFee_newBlockMetric;
}
