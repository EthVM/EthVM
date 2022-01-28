/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractTimestamp1
// ====================================================

export interface getContractTimestamp1_getTransactionByHash {
  __typename: "Tx";
  timestamp: number | null;
}

export interface getContractTimestamp1 {
  getTransactionByHash: getContractTimestamp1_getTransactionByHash;
}

export interface getContractTimestamp1Variables {
  hash: string;
}
