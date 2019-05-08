/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: blockByHash
// ====================================================

export interface blockByHash_blockDetail_header {
  __typename: "BlockHeader";
  number: any | null;
  hash: string | null;
  parentHash: string | null;
  nonce: any | null;
  sha3Uncles: string | null;
  logsBloom: string | null;
  transactionsRoot: string | null;
  stateRoot: string | null;
  receiptsRoot: string | null;
  author: string | null;
  difficulty: any | null;
  totalDifficulty: any | null;
  extraData: string | null;
  gasLimit: any | null;
  gasUsed: any | null;
  timestamp: number | null;
  size: number | null;
  blockTime: number | null;
}

export interface blockByHash_blockDetail_rewards {
  __typename: "Reward";
  address: string | null;
  deltaType: DeltaType | null;
  amount: any | null;
}

export interface blockByHash_blockDetail {
  __typename: "Block";
  header: blockByHash_blockDetail_header | null;
  uncleHashes: (string | null)[] | null;
  transactionHashes: (string | null)[] | null;
  rewards: (blockByHash_blockDetail_rewards | null)[] | null;
}

export interface blockByHash_transactionsSummary_items {
  __typename: "TransactionSummary";
  fee: any | null;
}

export interface blockByHash_transactionsSummary {
  __typename: "TransactionSummaryPage";
  items: (blockByHash_transactionsSummary_items | null)[] | null;
  totalCount: any | null;
}

export interface blockByHash {
  blockDetail: blockByHash_blockDetail | null;
  transactionsSummary: blockByHash_transactionsSummary;
}

export interface blockByHashVariables {
  blockHash?: string | null;
}
