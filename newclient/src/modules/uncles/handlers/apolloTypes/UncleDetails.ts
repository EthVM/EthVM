/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UncleDetails
// ====================================================

export interface UncleDetails_block_summary {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  timestamp: number;
}

export interface UncleDetails_block {
  __typename: "Block";
  hash: string;
  sha3Uncles: string;
  gasLimit: number;
  gasUsed: number;
  summary: UncleDetails_block_summary;
}

export interface UncleDetails {
  __typename: "Uncle";
  block: UncleDetails_block;
  unclePosition: number;
  parentBlockNumber: number;
}
