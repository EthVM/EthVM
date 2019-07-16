/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: newTransactions
// ====================================================

export interface newTransactions_newTransactions {
  __typename: "TransactionSummary";
  hash: string;
  blockNumber: any;
  transactionIndex: number;
  from: string;
  to: string | null;
  creates: string | null;
  contractName: string | null;
  contractSymbol: string | null;
  value: any;
  fee: any;
  successful: boolean;
  timestamp: any;
}

export interface newTransactions {
  newTransactions: newTransactions_newTransactions[];
}
