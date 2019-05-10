/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgTxFeesHistory
// ====================================================

export interface avgTxFeesHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any;
  value: any | null;
}

export interface avgTxFeesHistory {
  blockMetricsTimeseries: avgTxFeesHistory_blockMetricsTimeseries[];
}

export interface avgTxFeesHistoryVariables {
  start: any;
  end: any;
  bucket: TimeBucket;
}
