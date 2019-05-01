/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newTransaction
// ====================================================

export interface newTransaction_newTransaction {
  __typename: "TransactionSummary";
  hash: string | null;
  blockNumber: any | null;
  transactionIndex: number | null;
  from: string | null;
  to: string | null;
  creates: string | null;
  contractName: string | null;
  contractSymbol: string | null;
  value: any | null;
  fee: any | null;
  successful: boolean | null;
  timestamp: string | null;
}

export interface newTransaction {
  newTransaction: newTransaction_newTransaction | null;
}
