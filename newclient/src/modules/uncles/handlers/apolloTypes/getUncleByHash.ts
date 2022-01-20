/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUncleByHash
// ====================================================

export interface getUncleByHash_getUncleByHash_block_summary {
  __typename: "BlockSummary";
  number: number;
  miner: string;
  timestamp: number;
}

export interface getUncleByHash_getUncleByHash_block {
  __typename: "Block";
  hash: string;
  sha3Uncles: string;
  gasLimit: number;
  gasUsed: number;
  summary: getUncleByHash_getUncleByHash_block_summary;
}

export interface getUncleByHash_getUncleByHash {
  __typename: "Uncle";
  block: getUncleByHash_getUncleByHash_block;
  unclePosition: number;
  parentBlockNumber: number;
}

export interface getUncleByHash {
  getUncleByHash: getUncleByHash_getUncleByHash;
}

export interface getUncleByHashVariables {
  hash: string;
}
