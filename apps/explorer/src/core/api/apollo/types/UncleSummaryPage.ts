/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UncleSummaryPage
// ====================================================

export interface UncleSummaryPage_items {
  __typename: "Uncle";
  author: string;
  number: any;
  hash: string;
  nephewNumber: any;
  uncleIndex: number;
  uncleReward: any;
}

export interface UncleSummaryPage {
  __typename: "UnclePage";
  items: UncleSummaryPage_items[];
  totalCount: number;
}
