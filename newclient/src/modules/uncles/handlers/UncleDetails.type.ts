/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UncleDetails
// ====================================================

export interface UncleDetails_block_summary_rewards {
  __typename: "BlockRewards";
  txFees: string;
  total: string;
  uncles: string;
}

export interface UncleDetails_block_summary {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  txCount: number;
  timestamp: number;
  uncles: (string | null)[];
  rewards: UncleDetails_block_summary_rewards;
  txFail: number;
}

export interface UncleDetails_block {
  __typename: "Block";
  summary: UncleDetails_block_summary;
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

export interface UncleDetails {
  __typename: "Uncle";
  block: UncleDetails_block;
  parentHash: string;
  parentBlockNumber: number;
  unclePosition: number;
}
