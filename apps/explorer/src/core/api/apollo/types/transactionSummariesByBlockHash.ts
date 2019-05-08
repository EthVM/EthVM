/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: transactionSummariesByBlockHash
// ====================================================

export interface transactionSummariesByBlockHash_summaries_items {
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

export interface transactionSummariesByBlockHash_summaries {
  __typename: "TransactionSummaryPage";
  items: (transactionSummariesByBlockHash_summaries_items | null)[] | null;
  totalCount: any | null;
}

export interface transactionSummariesByBlockHash {
  summaries: transactionSummariesByBlockHash_summaries;
}

export interface transactionSummariesByBlockHashVariables {
  hash?: string | null;
  offset?: number | null;
  limit?: number | null;
}
