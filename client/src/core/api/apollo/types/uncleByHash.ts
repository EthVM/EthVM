/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: uncleByHash
// ====================================================

export interface uncleByHash_uncleDetail {
  __typename: "Uncle";
  author: string;
  number: any;
  gasLimit: any;
  gasUsed: any;
  hash: string;
  parentHash: string;
  sha3Uncles: string;
  timestamp: any;
  nephewNumber: any;
  uncleIndex: number;
}

export interface uncleByHash {
  uncleDetail: uncleByHash_uncleDetail | null;
}

export interface uncleByHashVariables {
  hash: string;
}
