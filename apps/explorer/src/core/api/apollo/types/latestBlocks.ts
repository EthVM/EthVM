/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestBlocks
// ====================================================

export interface latestBlocks_blockSummaries_items {
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

export interface latestBlocks_blockSummaries {
  __typename: "BlockSummaryPage";
  items: latestBlocks_blockSummaries_items[];
  totalCount: number;
}

export interface latestBlocks {
  blockSummaries: latestBlocks_blockSummaries;
}

export interface latestBlocksVariables {
  fromBlock?: any | null;
  offset?: number | null;
  limit?: number | null;
}
