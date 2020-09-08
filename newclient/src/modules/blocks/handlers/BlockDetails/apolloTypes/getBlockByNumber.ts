/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getBlockByNumber
// ====================================================

export interface getBlockByNumber_getBlockByNumber_summary_rewards {
  __typename: "BlockRewards";
  txFees: string;
  total: string;
  uncles: string;
}

export interface getBlockByNumber_getBlockByNumber_summary {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  txCount: number;
  timestamp: number;
  uncles: (string | null)[];
  rewards: getBlockByNumber_getBlockByNumber_summary_rewards;
  txFail: number;
}

export interface getBlockByNumber_getBlockByNumber {
  __typename: "Block";
  summary: getBlockByNumber_getBlockByNumber_summary;
  hash: string;
  parentHash: string;
  nonce: string;
  sha3Uncles: string;
  logsBloom: string;
  transactionsRoot: string;
  stateRoot: string;
  receiptsRoot: string;
  difficulty: string;
  totalDifficulty: string;
  extraData: string;
  size: number;
  gasLimit: number;
  gasUsed: number;
  transactions: (string | null)[];
}

export interface getBlockByNumber {
  getBlockByNumber: getBlockByNumber_getBlockByNumber;
}

export interface getBlockByNumberVariables {
  blockRef: number;
}
