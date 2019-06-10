/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestAvgGasPrices
// ====================================================

export interface latestAvgGasPrices_blockMetricsTransaction_items {
  __typename: "BlockMetricsTransaction";
  blockHash: string;
  number: any;
  avgGasPrice: any;
}

export interface latestAvgGasPrices_blockMetricsTransaction {
  __typename: "BlockMetricsTransactionPage";
  items: latestAvgGasPrices_blockMetricsTransaction_items[];
}

export interface latestAvgGasPrices {
  blockMetricsTransaction: latestAvgGasPrices_blockMetricsTransaction;
}

export interface latestAvgGasPricesVariables {
  limit?: number | null;
}
