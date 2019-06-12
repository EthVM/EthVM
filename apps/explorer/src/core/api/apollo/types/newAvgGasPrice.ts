/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newAvgGasPrice
// ====================================================

export interface newAvgGasPrice_newBlockMetricsTransaction {
  __typename: "BlockMetricsTransaction";
  blockHash: string;
  number: any;
  avgGasPrice: any;
}

export interface newAvgGasPrice {
  newBlockMetricsTransaction: newAvgGasPrice_newBlockMetricsTransaction;
}
