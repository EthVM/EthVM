/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestBlockStats
// ====================================================

export interface latestBlockStats_blockSummaries_items {
  __typename: "BlockSummary";
  number: any;
  timestamp: any;
  difficulty: any;
  numSuccessfulTxs: any;
  numFailedTxs: any;
}

export interface latestBlockStats_blockSummaries {
  __typename: "BlockSummaryPage";
  items: latestBlockStats_blockSummaries_items[];
}

export interface latestBlockStats {
  blockSummaries: latestBlockStats_blockSummaries;
}
