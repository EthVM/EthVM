/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlockTable
// ====================================================

export interface newBlockTable_newBlockFeed_rewards {
  __typename: "BlockRewards";
  total: string;
}

export interface newBlockTable_newBlockFeed {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  txCount: number;
  timestamp: number;
  rewards: newBlockTable_newBlockFeed_rewards;
}

export interface newBlockTable {
  newBlockFeed: newBlockTable_newBlockFeed;
}
