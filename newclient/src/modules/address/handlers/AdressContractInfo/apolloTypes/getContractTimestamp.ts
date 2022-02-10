/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractTimestamp
// ====================================================

export interface getContractTimestamp_getTransactionByHash {
  __typename: "Tx";
  timestamp: number | null;
}

export interface getContractTimestamp {
  getTransactionByHash: getContractTimestamp_getTransactionByHash;
}

export interface getContractTimestampVariables {
  hash: string;
}
