/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: uncles
// ====================================================

export interface uncles_uncles_items {
  __typename: "Uncle";
  author: string;
  number: any;
  hash: string;
  nephewNumber: any;
  uncleIndex: number;
  uncleReward: any;
}

export interface uncles_uncles {
  __typename: "UnclePage";
  items: uncles_uncles_items[];
  totalCount: number;
}

export interface uncles {
  uncles: uncles_uncles;
}

export interface unclesVariables {
  offset?: number | null;
  limit?: number | null;
  fromUncle?: any | null;
}
