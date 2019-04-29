/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Duration } from "./globalTypes";

// ====================================================
// GraphQL query operation: averageDifficulty
// ====================================================

export interface averageDifficulty_blockMetricsByDay {
  __typename: "BlockMetrics";
  date: string | null;
  value: any | null;
}

export interface averageDifficulty {
  blockMetricsByDay: (averageDifficulty_blockMetricsByDay | null)[] | null;
}

export interface averageDifficultyVariables {
  duration: Duration;
}
