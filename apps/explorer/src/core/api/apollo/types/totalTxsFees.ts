/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: totalTxsFees
// ====================================================

export interface totalTxsFees_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: string | null;
}

export interface totalTxsFees {
  blockMetricsByDay: (totalTxsFees_blockMetricsByDay | null)[] | null;
}

export interface totalTxsFeesVariables {
  duration: Duration;
}
