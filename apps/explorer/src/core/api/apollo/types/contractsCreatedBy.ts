/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: contractsCreatedBy
// ====================================================

export interface contractsCreatedBy_summaries_items {
  __typename: "ContractSummary";
  address: string;
  creator: string;
  blockNumber: any;
  txHash: string;
  timestamp: any;
  txFee: any;
}

export interface contractsCreatedBy_summaries {
  __typename: "ContractSummaryPage";
  items: contractsCreatedBy_summaries_items[];
  totalCount: number;
}

export interface contractsCreatedBy {
  summaries: contractsCreatedBy_summaries;
}

export interface contractsCreatedByVariables {
  address: string;
  offset?: number | null;
  limit?: number | null;
}
