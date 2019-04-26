/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: averageGasLimit
// ====================================================

export interface averageGasLimit_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: string | null;
}

export interface averageGasLimit {
  blockMetricsByDay: (averageGasLimit_blockMetricsByDay | null)[] | null;
}

export interface averageGasLimitVariables {
  duration: Duration;
}
