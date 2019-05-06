/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TimeBucket, BlockMetricField } from "./globalTypes";

// ====================================================
// GraphQL query operation: blockHistory
// ====================================================

export interface blockHistory_blockMetricsTimeseries {
  __typename: "AggregateBlockMetric";
  timestamp: any | null;
  avgBlockTime: number | null;
  avgNumUncles: number | null;
  avgDifficulty: any | null;
  avgTotalDifficulty: any | null;
  avgGasLimit: any | null;
  avgGasPrice: any | null;
  avgNumTxs: number | null;
  avgNumSuccessfulTxs: number | null;
  avgNumFailedTxs: number | null;
  avgNumInternalTxs: number | null;
  avgTxFees: any | null;
  avgTotalTxFees: any | null;
}

export interface blockHistory {
  blockMetricsTimeseries: (blockHistory_blockMetricsTimeseries | null)[];
}

export interface blockHistoryVariables {
  start?: any | null;
  end?: any | null;
  bucket?: TimeBucket | null;
  fields?: (BlockMetricField | null)[] | null;
}
