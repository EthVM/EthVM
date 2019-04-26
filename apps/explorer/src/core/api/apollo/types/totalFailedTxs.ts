/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: totalFailedTxs
// ====================================================

export interface totalFailedTxs_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: string | null;
}

export interface totalFailedTxs {
  blockMetricsByDay: (totalFailedTxs_blockMetricsByDay | null)[] | null;
}

export interface totalFailedTxsVariables {
  duration: Duration;
}
