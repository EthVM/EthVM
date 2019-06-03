/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ContractSummaryPage
// ====================================================

export interface ContractSummaryPage_items {
  __typename: "ContractSummary";
  address: string;
  creator: string;
  blockNumber: any;
  txHash: string;
  timestamp: any;
  txFee: any;
}

export interface ContractSummaryPage {
  __typename: "ContractSummaryPage";
  items: ContractSummaryPage_items[];
  totalCount: number;
}
