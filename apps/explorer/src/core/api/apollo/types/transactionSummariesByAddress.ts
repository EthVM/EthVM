/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FilterEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: transactionSummariesByAddress
// ====================================================

export interface transactionSummariesByAddress_summaries_items {
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

export interface transactionSummariesByAddress_summaries {
  __typename: "TransactionSummaryPage";
  items: transactionSummariesByAddress_summaries_items[];
  totalCount: number;
}

export interface transactionSummariesByAddress {
  summaries: transactionSummariesByAddress_summaries;
}

export interface transactionSummariesByAddressVariables {
  address: string;
  filter?: FilterEnum | null;
  offset?: number | null;
  limit?: number | null;
}
