/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: blockByNumber
// ====================================================

export interface blockByNumber_blockByNumber_header {
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

export interface blockByNumber_blockByNumber_transactions_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: string | null;
  status: string | null;
}

export interface blockByNumber_blockByNumber_transactions_traces {
  __typename: "Trace";
  error: string | null;
}

export interface blockByNumber_blockByNumber_transactions {
  __typename: "Transaction";
  hash: string | null;
  blockNumber: string | null;
  from: string | null;
  gasPrice: string | null;
  timestamp: string | null;
  to: string | null;
  value: string | null;
  receipt: blockByNumber_blockByNumber_transactions_receipt | null;
  traces: (blockByNumber_blockByNumber_transactions_traces | null)[] | null;
}

export interface blockByNumber_blockByNumber_rewards {
  __typename: "Reward";
  author: string | null;
  rewardType: DeltaType | null;
  value: string | null;
}

export interface blockByNumber_blockByNumber_uncles {
  __typename: "Uncle";
  hash: string | null;
}

export interface blockByNumber_blockByNumber {
  __typename: "Block";
  header: blockByNumber_blockByNumber_header | null;
  transactions: (blockByNumber_blockByNumber_transactions | null)[] | null;
  rewards: (blockByNumber_blockByNumber_rewards | null)[] | null;
  uncles: (blockByNumber_blockByNumber_uncles | null)[] | null;
}

export interface blockByNumber {
  blockByNumber: blockByNumber_blockByNumber | null;
}

export interface blockByNumberVariables {
  number?: number | null;
}
