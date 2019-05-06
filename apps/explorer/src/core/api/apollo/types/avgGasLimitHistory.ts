/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgGasLimitHistory
// ====================================================

export interface avgGasLimitHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any | null;
  value: any | null;
}

export interface avgGasLimitHistory {
  blockMetricsTimeseries: (avgGasLimitHistory_blockMetricsTimeseries | null)[];
}

export interface avgGasLimitHistoryVariables {
  start?: any | null;
  end?: any | null;
  bucket?: TimeBucket | null;
}
