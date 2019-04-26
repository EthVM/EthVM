/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: blockByHash
// ====================================================

export interface blockByHash_blockByHash_header {
  __typename: "BlockHeader";
  number: string | null;
  hash: string | null;
  timestamp: string | null;
  author: string | null;
  parentHash: string | null;
  difficulty: string | null;
  size: string | null;
  nonce: string | null;
  stateRoot: string | null;
  extraData: string | null;
  gasLimit: string | null;
  gasUsed: string | null;
  logsBloom: string | null;
  sha3Uncles: string | null;
  transactionsRoot: string | null;
  receiptsRoot: string | null;
  totalDifficulty: string | null;
}

export interface blockByHash_blockByHash_transactions_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: string | null;
  status: string | null;
}

export interface blockByHash_blockByHash_transactions_traces {
  __typename: "Trace";
  error: string | null;
}

export interface blockByHash_blockByHash_transactions {
  __typename: "Transaction";
  hash: string | null;
  blockNumber: string | null;
  from: string | null;
  gasPrice: string | null;
  timestamp: string | null;
  to: string | null;
  value: string | null;
  receipt: blockByHash_blockByHash_transactions_receipt | null;
  traces: (blockByHash_blockByHash_transactions_traces | null)[] | null;
}

export interface blockByHash_blockByHash_rewards {
  __typename: "Reward";
  author: string | null;
  rewardType: DeltaType | null;
  value: string | null;
}

export interface blockByHash_blockByHash_uncles {
  __typename: "Uncle";
  hash: string | null;
}

export interface blockByHash_blockByHash {
  __typename: "Block";
  header: blockByHash_blockByHash_header | null;
  transactions: (blockByHash_blockByHash_transactions | null)[] | null;
  rewards: (blockByHash_blockByHash_rewards | null)[] | null;
  uncles: (blockByHash_blockByHash_uncles | null)[] | null;
}

export interface blockByHash {
  blockByHash: blockByHash_blockByHash | null;
}

export interface blockByHashVariables {
  hash?: string | null;
}
