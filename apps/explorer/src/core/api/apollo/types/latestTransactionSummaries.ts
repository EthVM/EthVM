/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestTransactionSummaries
// ====================================================

export interface latestTransactionSummaries_summaries_items {
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

export interface latestTransactionSummaries_summaries {
  __typename: "TransactionSummaryPage";
  items: latestTransactionSummaries_summaries_items[];
  totalCount: number;
}

export interface latestTransactionSummaries {
  summaries: latestTransactionSummaries_summaries;
}

export interface latestTransactionSummariesVariables {
  fromBlock?: any | null;
  offset?: number | null;
  limit?: number | null;
}
