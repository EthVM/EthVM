/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UnclePage
// ====================================================

export interface UnclePage_items {
  __typename: "Uncle";
  author: string;
  number: any;
  hash: string;
  nephewNumber: any;
  uncleIndex: number;
  uncleReward: any;
}

export interface UnclePage {
  __typename: "UnclePage";
  items: UnclePage_items[];
  totalCount: number;
}
