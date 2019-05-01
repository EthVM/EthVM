/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: totalGasPrice
// ====================================================

export interface totalGasPrice_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: any | null;
}

export interface totalGasPrice {
  blockMetricsByDay: (totalGasPrice_blockMetricsByDay | null)[] | null;
}

export interface totalGasPriceVariables {
  duration: Duration;
}
