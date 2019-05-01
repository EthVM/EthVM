/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestBlocks
// ====================================================

export interface latestBlocks_blockSummaries_items {
  __typename: "BlockSummary";
  number: any | null;
  hash: string | null;
  author: string | null;
  numTxs: any | null;
  numSuccessfulTxs: any | null;
  numFailedTxs: any | null;
  reward: any | null;
  uncleHashes: (string | null)[] | null;
  transactionHashes: (string | null)[] | null;
  difficulty: any | null;
  timestamp: string | null;
}

export interface latestBlocks_blockSummaries {
  __typename: "BlockSummaryPage";
  items: (latestBlocks_blockSummaries_items | null)[] | null;
  totalCount: any | null;
}

export interface latestBlocks {
  blockSummaries: latestBlocks_blockSummaries | null;
}

export interface latestBlocksVariables {
  offset?: number | null;
  limit?: number | null;
}
