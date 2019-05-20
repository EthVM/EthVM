/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: blocks
// ====================================================

export interface blocks_blocks_header {
  __typename: "BlockHeader";
  hash: string;
  number: any;
  author: string;
}

export interface blocks_blocks_rewards {
  __typename: "Reward";
  value: any;
}

export interface blocks_blocks {
  __typename: "Block";
  header: blocks_blocks_header;
  transactionHashes: string[];
  uncleHashes: string[];
  rewards: blocks_blocks_rewards[];
}

export interface blocks {
  blocks: blocks_blocks[];
}

export interface blocksVariables {
  limit?: number | null;
  page?: number | null;
  fromBlock?: any | null;
}
