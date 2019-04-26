/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: blocks
// ====================================================

export interface blocks_blocks_header {
  __typename: "BlockHeader";
  hash: string | null;
  number: string | null;
  author: string | null;
}

export interface blocks_blocks_transactions_receipt {
  __typename: "Receipt";
  status: string | null;
}

export interface blocks_blocks_transactions_traces {
  __typename: "Trace";
  error: string | null;
}

export interface blocks_blocks_transactions {
  __typename: "Transaction";
  hash: string | null;
  receipt: blocks_blocks_transactions_receipt | null;
  traces: (blocks_blocks_transactions_traces | null)[] | null;
}

export interface blocks_blocks_rewards {
  __typename: "Reward";
  value: string | null;
}

export interface blocks_blocks_uncles {
  __typename: "Uncle";
  hash: string | null;
}

export interface blocks_blocks {
  __typename: "Block";
  header: blocks_blocks_header | null;
  transactions: (blocks_blocks_transactions | null)[] | null;
  rewards: (blocks_blocks_rewards | null)[] | null;
  uncles: (blocks_blocks_uncles | null)[] | null;
}

export interface blocks {
  blocks: (blocks_blocks | null)[] | null;
}

export interface blocksVariables {
  limit?: number | null;
  page?: number | null;
  fromBlock?: any | null;
}
