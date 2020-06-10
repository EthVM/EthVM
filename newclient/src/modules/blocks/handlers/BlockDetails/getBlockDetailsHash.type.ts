/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getBlockDetailsHash
// ====================================================

export interface getBlockDetailsHash_getBlockByHash_summary_rewards {
  __typename: "BlockRewards";
  txFees: string;
  total: string;
  uncles: string;
}

export interface getBlockDetailsHash_getBlockByHash_summary {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  txCount: number;
  timestamp: number;
  uncles: (string | null)[];
  rewards: getBlockDetailsHash_getBlockByHash_summary_rewards;
  txFail: number;
}

export interface getBlockDetailsHash_getBlockByHash {
  __typename: "Block";
  summary: getBlockDetailsHash_getBlockByHash_summary;
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

export interface getBlockDetailsHash {
  getBlockByHash: getBlockDetailsHash_getBlockByHash;
}

export interface getBlockDetailsHashVariables {
  blockRef: string;
}
