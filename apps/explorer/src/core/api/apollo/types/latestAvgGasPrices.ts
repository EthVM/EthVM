/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestAvgGasPrices
// ====================================================

export interface latestAvgGasPrices_blockMetrics_items {
  __typename: "BlockMetric";
  blockHash: string;
  number: any;
  avgGasPrice: any;
}

export interface latestAvgGasPrices_blockMetrics {
  __typename: "BlockMetricsPage";
  items: latestAvgGasPrices_blockMetrics_items[];
}

export interface latestAvgGasPrices {
  blockMetrics: latestAvgGasPrices_blockMetrics;
}

export interface latestAvgGasPricesVariables {
  limit?: number | null;
}
