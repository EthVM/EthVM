/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newAvgGasPrice
// ====================================================

export interface newAvgGasPrice_newBlockMetric {
  __typename: "BlockMetric";
  blockHash: string;
  number: any;
  avgGasPrice: any;
}

export interface newAvgGasPrice {
  newBlockMetric: newAvgGasPrice_newBlockMetric;
}
