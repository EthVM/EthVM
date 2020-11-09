/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTransaction
// ====================================================

export interface getTransaction_getTransactionByHash {
  __typename: "Tx";
  timestamp: number | null;
}

export interface getTransaction {
  getTransactionByHash: getTransaction_getTransactionByHash;
}

export interface getTransactionVariables {
  hash: string;
}
