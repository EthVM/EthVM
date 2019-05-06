/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgBlockTimeHistory
// ====================================================

export interface avgBlockTimeHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any | null;
  value: number | null;
}

export interface avgBlockTimeHistory {
  blockMetricsTimeseries: (avgBlockTimeHistory_blockMetricsTimeseries | null)[];
}

export interface avgBlockTimeHistoryVariables {
  start?: any | null;
  end?: any | null;
  bucket?: TimeBucket | null;
}
