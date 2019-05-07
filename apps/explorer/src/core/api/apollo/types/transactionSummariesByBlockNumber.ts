/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: transactionSummariesByBlockNumber
// ====================================================

export interface transactionSummariesByBlockNumber_summaries_items {
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

export interface transactionSummariesByBlockNumber_summaries {
  __typename: "TransactionSummaryPage";
  items: (transactionSummariesByBlockNumber_summaries_items | null)[] | null;
  totalCount: any | null;
}

export interface transactionSummariesByBlockNumber {
  summaries: transactionSummariesByBlockNumber_summaries;
}

export interface transactionSummariesByBlockNumberVariables {
  number?: any | null;
  offset?: number | null;
  limit?: number | null;
}
