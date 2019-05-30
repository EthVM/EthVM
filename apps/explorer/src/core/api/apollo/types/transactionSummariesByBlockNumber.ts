/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: transactionSummariesByBlockNumber
// ====================================================

export interface transactionSummariesByBlockNumber_summaries_items {
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

export interface transactionSummariesByBlockNumber_summaries {
  __typename: "TransactionSummaryPage";
  items: transactionSummariesByBlockNumber_summaries_items[];
  totalCount: number;
}

export interface transactionSummariesByBlockNumber {
  summaries: transactionSummariesByBlockNumber_summaries;
}

export interface transactionSummariesByBlockNumberVariables {
  number: any;
  offset?: number | null;
  limit?: number | null;
}
