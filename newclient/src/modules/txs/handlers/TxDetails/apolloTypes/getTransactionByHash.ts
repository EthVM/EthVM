/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTransactionByHash
// ====================================================

export interface getTransactionByHash_getTransactionByHash {
  __typename: "Tx";
  blockNumber: number | null;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string | null;
  timestamp: number | null;
  hash: string;
  input: string;
  status: string | null;
  nonce: number;
  to: string | null;
  transactionIndex: number | null;
  value: string;
  replacedBy: string | null;
  contractAddress: string | null;
}

export interface getTransactionByHash {
  getTransactionByHash: getTransactionByHash_getTransactionByHash;
}

export interface getTransactionByHashVariables {
  hash: string;
}
