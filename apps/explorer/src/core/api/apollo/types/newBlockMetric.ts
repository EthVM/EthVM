/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlockMetric
// ====================================================

export interface newBlockMetric_newBlockMetric {
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

export interface newBlockMetric {
  newBlockMetric: newBlockMetric_newBlockMetric;
}
