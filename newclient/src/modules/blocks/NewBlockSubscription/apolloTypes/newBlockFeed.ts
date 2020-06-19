/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newBlockFeed
// ====================================================

export interface newBlockFeed_newBlockFeed {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  txCount: number;
  timestamp: number;
}

export interface newBlockFeed {
  newBlockFeed: newBlockFeed_newBlockFeed;
}
