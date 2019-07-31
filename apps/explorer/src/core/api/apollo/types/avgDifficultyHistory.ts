/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgDifficultyHistory
// ====================================================

export interface avgDifficultyHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any;
  value: any | null;
}

export interface avgDifficultyHistory {
  blockMetricsTimeseries: avgDifficultyHistory_blockMetricsTimeseries[];
}

export interface avgDifficultyHistoryVariables {
  bucket: TimeBucket;
  start?: any | null;
  end?: any | null;
}
