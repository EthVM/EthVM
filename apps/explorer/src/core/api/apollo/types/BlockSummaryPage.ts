/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BlockSummaryPage
// ====================================================

export interface BlockSummaryPage_items {
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

export interface BlockSummaryPage {
  __typename: "BlockSummaryPage";
  items: BlockSummaryPage_items[];
  totalCount: number;
}
