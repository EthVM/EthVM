/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BlockMetricPage
// ====================================================

export interface BlockMetricPage_items {
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

export interface BlockMetricPage {
  __typename: "BlockMetricPage";
  items: BlockMetricPage_items[];
  offset: number;
  limit: number;
  totalCount: number;
}
