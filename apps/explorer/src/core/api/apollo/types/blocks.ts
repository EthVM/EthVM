/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: blocks
// ====================================================

export interface blocks_blocks_header {
  __typename: "BlockHeader";
  hash: string | null;
  number: any | null;
  author: string | null;
}

export interface blocks_blocks_rewards {
  __typename: "Reward";
  value: any | null;
}

export interface blocks_blocks {
  __typename: "Block";
  header: blocks_blocks_header | null;
  transactionHashes: (string | null)[] | null;
  uncleHashes: (string | null)[] | null;
  rewards: (blocks_blocks_rewards | null)[] | null;
}

export interface blocks {
  blocks: (blocks_blocks | null)[] | null;
}

export interface blocksVariables {
  limit?: number | null;
  page?: number | null;
  fromBlock?: any | null;
}
