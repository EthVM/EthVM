/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: transactionSummariesByBlockHash
// ====================================================

export interface transactionSummariesByBlockHash_summaries_items {
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

export interface transactionSummariesByBlockHash_summaries {
  __typename: "TransactionSummaryPage";
  items: transactionSummariesByBlockHash_summaries_items[];
  totalCount: number;
}

export interface transactionSummariesByBlockHash {
  summaries: transactionSummariesByBlockHash_summaries;
}

export interface transactionSummariesByBlockHashVariables {
  hash: string;
  offset?: number | null;
  limit?: number | null;
}
