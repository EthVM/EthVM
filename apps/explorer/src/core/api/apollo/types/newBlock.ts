/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlock
// ====================================================

export interface newBlock_newBlock {
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

export interface newBlock {
  newBlock: newBlock_newBlock | null;
}
