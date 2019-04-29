/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: averageGasPrice
// ====================================================

export interface averageGasPrice_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: any | null;
}

export interface averageGasPrice {
  blockMetricsByDay: (averageGasPrice_blockMetricsByDay | null)[] | null;
}

export interface averageGasPriceVariables {
  duration: Duration;
}
