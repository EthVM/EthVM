/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: averageTxFee
// ====================================================

export interface averageTxFee_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: any | null;
}

export interface averageTxFee {
  blockMetricsByDay: (averageTxFee_blockMetricsByDay | null)[] | null;
}

export interface averageTxFeeVariables {
  duration: Duration;
}
