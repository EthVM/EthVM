/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlockStats
// ====================================================

export interface newBlockStats_newBlock {
  __typename: "BlockSummary";
  number: any;
  timestamp: any;
  difficulty: any;
  numSuccessfulTxs: any;
  numFailedTxs: any;
}

export interface newBlockStats {
  newBlock: newBlockStats_newBlock;
}
