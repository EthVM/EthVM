/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgGasLimitHistory
// ====================================================

export interface avgGasLimitHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any;
  value: any | null;
}

export interface avgGasLimitHistory {
  blockMetricsTimeseries: avgGasLimitHistory_blockMetricsTimeseries[];
}

export interface avgGasLimitHistoryVariables {
  start: any;
  end: any;
  bucket: TimeBucket;
}
