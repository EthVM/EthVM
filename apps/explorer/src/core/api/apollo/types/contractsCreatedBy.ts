/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: contractsCreatedBy
// ====================================================

export interface contractsCreatedBy_contractsCreatedBy_items {
  __typename: "ContractSummary";
  address: string;
  creator: string;
  blockNumber: any;
  txHash: string;
  timestamp: number;
  txFee: any;
}

export interface contractsCreatedBy_contractsCreatedBy {
  __typename: "ContractSummaryPage";
  items: contractsCreatedBy_contractsCreatedBy_items[];
  totalCount: number;
}

export interface contractsCreatedBy {
  contractsCreatedBy: contractsCreatedBy_contractsCreatedBy;
}

export interface contractsCreatedByVariables {
  hash: string;
  offset?: number | null;
  limit?: number | null;
}
