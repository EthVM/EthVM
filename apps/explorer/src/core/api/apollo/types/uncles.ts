/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: uncles
// ====================================================

export interface uncles_uncles {
  __typename: "Uncle";
  author: string | null;
  number: string | null;
  hash: string | null;
  nephewNumber: string | null;
  uncleIndex: number | null;
  uncleReward: string | null;
}

export interface uncles {
  uncles: (uncles_uncles | null)[];
}

export interface unclesVariables {
  limit?: number | null;
  page?: number | null;
  fromUncle?: number | null;
}
