/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgGasPriceHistory
// ====================================================

export interface avgGasPriceHistory_aggregateBlockMetrics_items {
  __typename: "AggregateBlockMetric";
  timestamp: any | null;
  avgGasPrice: any | null;
}

export interface avgGasPriceHistory_aggregateBlockMetrics {
  __typename: "AggregateBlockMetricPage";
  totalCount: number | null;
  items: (avgGasPriceHistory_aggregateBlockMetrics_items | null)[] | null;
}

export interface avgGasPriceHistory {
  aggregateBlockMetrics: avgGasPriceHistory_aggregateBlockMetrics;
}

export interface avgGasPriceHistoryVariables {
  start: any;
  end: any;
  bucket: TimeBucket;
  offset?: number | null;
  limit?: number | null;
}
