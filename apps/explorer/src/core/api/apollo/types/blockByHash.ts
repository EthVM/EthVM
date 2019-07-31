/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: blockByHash
// ====================================================

export interface blockByHash_blockDetail_header {
  __typename: "BlockHeader";
  number: any;
  hash: string;
  parentHash: string;
  nonce: any | null;
  sha3Uncles: string;
  logsBloom: string;
  transactionsRoot: string;
  stateRoot: string;
  receiptsRoot: string;
  author: string;
  difficulty: any;
  totalDifficulty: any;
  extraData: string;
  gasLimit: any;
  gasUsed: any;
  timestamp: any;
  size: number;
  blockTime: number | null;
}

export interface blockByHash_blockDetail_rewards {
  __typename: "Reward";
  address: string;
  deltaType: DeltaType;
  amount: any;
}

export interface blockByHash_blockDetail {
  __typename: "Block";
  header: blockByHash_blockDetail_header;
  uncleHashes: string[];
  transactionHashes: string[];
  rewards: blockByHash_blockDetail_rewards[];
  totalTxFees: any;
}

export interface blockByHash {
  blockDetail: blockByHash_blockDetail | null;
}

export interface blockByHashVariables {
  blockHash: string;
}
