/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestBlockStats
// ====================================================

export interface latestBlockStats_blockSummaries_items {
  __typename: "BlockSummary";
  number: any | null;
  timestamp: string | null;
  difficulty: any | null;
  numSuccessfulTxs: any | null;
  numFailedTxs: any | null;
}

export interface latestBlockStats_blockSummaries {
  __typename: "BlockSummaryPage";
  items: (latestBlockStats_blockSummaries_items | null)[] | null;
}

export interface latestBlockStats {
  blockSummaries: latestBlockStats_blockSummaries;
}
