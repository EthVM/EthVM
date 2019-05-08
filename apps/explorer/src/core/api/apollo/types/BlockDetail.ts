/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL fragment: BlockDetail
// ====================================================

export interface BlockDetail_header {
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

export interface BlockDetail_rewards {
  __typename: "Reward";
  address: string | null;
  deltaType: DeltaType | null;
  amount: any | null;
}

export interface BlockDetail {
  __typename: "Block";
  header: BlockDetail_header | null;
  uncleHashes: (string | null)[] | null;
  transactionHashes: (string | null)[] | null;
  rewards: (BlockDetail_rewards | null)[] | null;
}
