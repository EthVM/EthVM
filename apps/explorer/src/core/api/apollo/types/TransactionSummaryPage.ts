/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TransactionSummaryPage
// ====================================================

export interface TransactionSummaryPage_items {
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

export interface TransactionSummaryPage {
  __typename: "TransactionSummaryPage";
  items: (TransactionSummaryPage_items | null)[] | null;
  totalCount: any | null;
}
