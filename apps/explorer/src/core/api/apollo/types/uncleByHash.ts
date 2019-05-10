/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: uncleByHash
// ====================================================

export interface uncleByHash_uncleByHash {
  __typename: "Uncle";
  author: string;
  number: any;
  gasLimit: any;
  gasUsed: any;
  hash: string;
  parentHash: string;
  sha3Uncles: string;
  timestamp: number;
  nephewNumber: any;
  uncleIndex: number;
}

export interface uncleByHash {
  uncleByHash: uncleByHash_uncleByHash | null;
}

export interface uncleByHashVariables {
  hash: string;
}
