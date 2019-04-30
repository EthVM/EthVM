/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BlockSummaryPage
// ====================================================

export interface BlockSummaryPage_items {
  __typename: "BlockSummary";
  number: any | null;
  hash: string | null;
  author: string | null;
  numTxs: any | null;
  numSuccessfulTxs: any | null;
  numFailedTxs: any | null;
  reward: any | null;
  uncleHashes: (string | null)[] | null;
}

export interface BlockSummaryPage {
  __typename: "BlockSummaryPage";
  items: (BlockSummaryPage_items | null)[] | null;
  totalCount: any | null;
}
