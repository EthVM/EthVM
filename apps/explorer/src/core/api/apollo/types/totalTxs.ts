/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: totalTxs
// ====================================================

export interface totalTxs_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: string | null;
}

export interface totalTxs {
  blockMetricsByDay: (totalTxs_blockMetricsByDay | null)[] | null;
}

export interface totalTxsVariables {
  duration: Duration;
}
