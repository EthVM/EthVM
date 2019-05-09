/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgGasPriceHistory
// ====================================================

export interface avgGasPriceHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any;
  value: any | null;
}

export interface avgGasPriceHistory {
  blockMetricsTimeseries: avgGasPriceHistory_blockMetricsTimeseries[];
}

export interface avgGasPriceHistoryVariables {
  start: any;
  end: any;
  bucket: TimeBucket;
}
