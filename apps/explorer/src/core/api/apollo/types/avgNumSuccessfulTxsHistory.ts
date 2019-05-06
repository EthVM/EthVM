/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket } from "./globalTypes";

// ====================================================
// GraphQL query operation: avgNumSuccessfulTxsHistory
// ====================================================

export interface avgNumSuccessfulTxsHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any | null;
  value: number | null;
}

export interface avgNumSuccessfulTxsHistory {
  blockMetricsTimeseries: (avgNumSuccessfulTxsHistory_blockMetricsTimeseries | null)[];
}

export interface avgNumSuccessfulTxsHistoryVariables {
  start?: any | null;
  end?: any | null;
  bucket?: TimeBucket | null;
}
