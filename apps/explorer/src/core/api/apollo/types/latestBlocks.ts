/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestBlocks
// ====================================================

export interface latestBlocks_blockSummaries_summaries {
  __typename: "BlockSummary";
  number: any | null;
  hash: string | null;
  author: string | null;
  numSuccessfulTxs: any | null;
  numFailedTxs: any | null;
  reward: any | null;
  uncleHashes: (string | null)[] | null;
}

export interface latestBlocks_blockSummaries {
  __typename: "BlockSummaryPage";
  summaries: (latestBlocks_blockSummaries_summaries | null)[] | null;
  totalCount: any | null;
}

export interface latestBlocks {
  blockSummaries: latestBlocks_blockSummaries | null;
}

export interface latestBlocksVariables {
  limit?: number | null;
}
