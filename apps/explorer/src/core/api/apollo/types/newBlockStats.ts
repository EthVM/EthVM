/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlockStats
// ====================================================

export interface newBlockStats_newBlock {
  __typename: "BlockSummary";
  number: any | null;
  timestamp: string | null;
  difficulty: any | null;
  numSuccessfulTxs: any | null;
  numFailedTxs: any | null;
}

export interface newBlockStats {
  newBlock: newBlockStats_newBlock | null;
}
