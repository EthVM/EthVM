/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestTransactions
// ====================================================

export interface latestTransactions_transactionSummaries_items {
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

export interface latestTransactions_transactionSummaries {
  __typename: "TransactionSummaryPage";
  items: (latestTransactions_transactionSummaries_items | null)[] | null;
  totalCount: any | null;
}

export interface latestTransactions {
  transactionSummaries: latestTransactions_transactionSummaries | null;
}

export interface latestTransactionsVariables {
  offset?: number | null;
  limit?: number | null;
}
