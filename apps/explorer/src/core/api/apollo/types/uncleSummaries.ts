/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: uncleSummaries
// ====================================================

export interface uncleSummaries_summaries_items {
  __typename: "Uncle";
  author: string;
  number: any;
  hash: string;
  nephewNumber: any;
  uncleIndex: number;
  uncleReward: any;
}

export interface uncleSummaries_summaries {
  __typename: "UnclePage";
  items: uncleSummaries_summaries_items[];
  totalCount: number;
}

export interface uncleSummaries {
  summaries: uncleSummaries_summaries;
}

export interface uncleSummariesVariables {
  offset?: number | null;
  limit?: number | null;
  fromUncle?: any | null;
}
