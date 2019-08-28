/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BlockSummaryByAuthorPage
// ====================================================

export interface BlockSummaryByAuthorPage_items {
  __typename: "BlockSummary";
  number: any;
  hash: string;
  author: string;
  numTxs: any;
  numSuccessfulTxs: any;
  numFailedTxs: any;
  reward: any;
  uncleHashes: string[];
  transactionHashes: string[];
  difficulty: any;
  timestamp: any;
}

export interface BlockSummaryByAuthorPage {
  __typename: "BlockSummaryByAuthorPage";
  items: BlockSummaryByAuthorPage_items[];
  hasMore: boolean;
}
