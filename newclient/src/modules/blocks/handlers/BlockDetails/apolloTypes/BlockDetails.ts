/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BlockDetails
// ====================================================

export interface BlockDetails_summary_rewards {
  __typename: "BlockRewards";
  txFees: string;
  total: string;
  uncles: string;
}

export interface BlockDetails_summary {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  txCount: number;
  timestamp: number;
  uncles: (string | null)[];
  rewards: BlockDetails_summary_rewards;
  txFail: number;
}

export interface BlockDetails {
  __typename: "Block";
  summary: BlockDetails_summary;
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
