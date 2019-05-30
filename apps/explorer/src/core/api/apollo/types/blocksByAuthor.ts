/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: blocksByAuthor
// ====================================================

export interface blocksByAuthor_blockSummaries_items {
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

export interface blocksByAuthor_blockSummaries {
  __typename: "BlockSummaryPage";
  items: blocksByAuthor_blockSummaries_items[];
  totalCount: number;
}

export interface blocksByAuthor {
  blockSummaries: blocksByAuthor_blockSummaries;
}

export interface blocksByAuthorVariables {
  author: string;
  offset?: number | null;
  limit?: number | null;
}
