/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUncleByHash
// ====================================================

export interface getUncleByHash_getUncleByHash_block_summary_rewards {
  __typename: "BlockRewards";
  txFees: string;
  total: string;
  uncles: string;
}

export interface getUncleByHash_getUncleByHash_block_summary {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  txCount: number;
  timestamp: number;
  uncles: (string | null)[];
  rewards: getUncleByHash_getUncleByHash_block_summary_rewards;
  txFail: number;
}

export interface getUncleByHash_getUncleByHash_block {
  __typename: "Block";
  summary: getUncleByHash_getUncleByHash_block_summary;
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

export interface getUncleByHash_getUncleByHash {
  __typename: "Uncle";
  block: getUncleByHash_getUncleByHash_block;
  parentHash: string;
  parentBlockNumber: number;
  unclePosition: number;
}

export interface getUncleByHash {
  getUncleByHash: getUncleByHash_getUncleByHash;
}

export interface getUncleByHashVariables {
  hash: string;
}
