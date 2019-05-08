/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgGasPrice
// ====================================================

export interface avgGasPrice_aggregateBlockMetrics_items {
  __typename: "AggregateBlockMetric";
  timestamp: any | null;
  avgGasPrice: any | null;
}

export interface avgGasPrice_aggregateBlockMetrics {
  __typename: "AggregateBlockMetricPage";
  totalCount: number | null;
  items: (avgGasPrice_aggregateBlockMetrics_items | null)[] | null;
}

export interface avgGasPrice {
  aggregateBlockMetrics: avgGasPrice_aggregateBlockMetrics;
}

export interface avgGasPriceVariables {
  start: any;
  end: any;
  bucket: TimeBucket;
  offset?: number | null;
  limit?: number | null;
}
