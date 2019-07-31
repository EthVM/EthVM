/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: blockByNumber
// ====================================================

export interface blockByNumber_blockDetail_header {
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

export interface blockByNumber_blockDetail_rewards {
  __typename: "Reward";
  address: string;
  deltaType: DeltaType;
  amount: any;
}

export interface blockByNumber_blockDetail {
  __typename: "Block";
  header: blockByNumber_blockDetail_header;
  uncleHashes: string[];
  transactionHashes: string[];
  rewards: blockByNumber_blockDetail_rewards[];
  totalTxFees: any;
}

export interface blockByNumber {
  blockDetail: blockByNumber_blockDetail | null;
}

export interface blockByNumberVariables {
  blockNumber: any;
}
