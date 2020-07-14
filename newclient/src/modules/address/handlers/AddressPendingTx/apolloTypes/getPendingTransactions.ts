/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPendingTransactions
// ====================================================

export interface getPendingTransactions_getPendingTransactions {
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
}

export interface getPendingTransactions {
  getPendingTransactions: (getPendingTransactions_getPendingTransactions | null)[];
}

export interface getPendingTransactionsVariables {
  hash: string;
}
