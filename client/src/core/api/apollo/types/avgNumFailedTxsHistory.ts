/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgNumFailedTxsHistory
// ====================================================

export interface avgNumFailedTxsHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any;
  value: number | null;
}

export interface avgNumFailedTxsHistory {
  blockMetricsTimeseries: avgNumFailedTxsHistory_blockMetricsTimeseries[];
}

export interface avgNumFailedTxsHistoryVariables {
  bucket: TimeBucket;
  start?: any | null;
  end?: any | null;
}
