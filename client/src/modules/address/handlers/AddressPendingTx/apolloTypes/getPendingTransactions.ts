/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPendingTransactions
// ====================================================

export interface getPendingTransactions_getPendingTransactions {
  __typename: "Tx";
  from: string;
  to: string | null;
  timestamp: number | null;
  value: string;
  gas: string;
  gasPrice: string;
  hash: string;
}

export interface getPendingTransactions {
  getPendingTransactions: (getPendingTransactions_getPendingTransactions | null)[];
}

export interface getPendingTransactionsVariables {
  hash: string;
}
