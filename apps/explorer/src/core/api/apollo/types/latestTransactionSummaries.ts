/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestTransactionSummaries
// ====================================================

export interface latestTransactionSummaries_summaries_items {
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

export interface latestTransactionSummaries_summaries {
  __typename: "TransactionSummaryPage";
  items: (latestTransactionSummaries_summaries_items | null)[] | null;
  totalCount: any | null;
}

export interface latestTransactionSummaries {
  summaries: latestTransactionSummaries_summaries | null;
}

export interface latestTransactionSummariesVariables {
  offset?: number | null;
  limit?: number | null;
}
