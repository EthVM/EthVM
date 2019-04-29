/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BlockSummaryPage
// ====================================================

export interface BlockSummaryPage_summaries {
  __typename: "BlockSummary";
  number: any | null;
  hash: string | null;
  author: string | null;
  numSuccessfulTxs: any | null;
  numFailedTxs: any | null;
  reward: any | null;
  uncleHashes: (string | null)[] | null;
}

export interface BlockSummaryPage {
  __typename: "BlockSummaryPage";
  summaries: (BlockSummaryPage_summaries | null)[] | null;
  totalCount: any | null;
}
