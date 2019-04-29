/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: uncleByHash
// ====================================================

export interface uncleByHash_uncleByHash {
  __typename: "Uncle";
  author: string | null;
  number: any | null;
  gasLimit: any | null;
  gasUsed: any | null;
  hash: string | null;
  parentHash: string | null;
  sha3Uncles: string | null;
  timestamp: string | null;
  nephewNumber: any | null;
  uncleIndex: number | null;
}

export interface uncleByHash {
  uncleByHash: uncleByHash_uncleByHash | null;
}

export interface uncleByHashVariables {
  hash: string;
}
