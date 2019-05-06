/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlockMetric
// ====================================================

export interface newBlockMetric_newBlockMetric {
  __typename: "BlockMetric";
  number: any;
  blockHash: string | null;
  timestamp: any | null;
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

export interface newBlockMetric {
  newBlockMetric: newBlockMetric_newBlockMetric | null;
}
