/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgTxFeesHistory
// ====================================================

export interface avgTxFeesHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any | null;
  value: any | null;
}

export interface avgTxFeesHistory {
  blockMetricsTimeseries: (avgTxFeesHistory_blockMetricsTimeseries | null)[];
}

export interface avgTxFeesHistoryVariables {
  start?: any | null;
  end?: any | null;
  bucket?: TimeBucket | null;
}
