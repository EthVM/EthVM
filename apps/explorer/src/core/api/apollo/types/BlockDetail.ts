/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL fragment: BlockDetail
// ====================================================

export interface BlockDetail_header {
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
  blockTime: number;
}

export interface BlockDetail_rewards {
  __typename: "Reward";
  address: string;
  deltaType: DeltaType;
  amount: any;
}

export interface BlockDetail {
  __typename: "Block";
  header: BlockDetail_header;
  uncleHashes: string[];
  transactionHashes: string[];
  rewards: BlockDetail_rewards[];
}
