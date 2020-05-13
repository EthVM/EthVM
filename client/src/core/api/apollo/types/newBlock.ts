/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlock
// ====================================================

export interface newBlock_newBlock {
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

export interface newBlock {
  newBlock: newBlock_newBlock;
}
