/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: totalSuccessfulTxs
// ====================================================

export interface totalSuccessfulTxs_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: number | null;
}

export interface totalSuccessfulTxs {
  blockMetricsByDay: (totalSuccessfulTxs_blockMetricsByDay | null)[] | null;
}

export interface totalSuccessfulTxsVariables {
  duration: Duration;
}
