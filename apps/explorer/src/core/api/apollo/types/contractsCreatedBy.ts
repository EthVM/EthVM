/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: contractsCreatedBy
// ====================================================

export interface contractsCreatedBy_contractsCreatedBy_items_tx_receipt {
  __typename: "Receipt";
  gasUsed: any | null;
}

export interface contractsCreatedBy_contractsCreatedBy_items_tx {
  __typename: "Transaction";
  hash: string | null;
  timestamp: string | null;
  gasPrice: any | null;
  receipt: contractsCreatedBy_contractsCreatedBy_items_tx_receipt | null;
}

export interface contractsCreatedBy_contractsCreatedBy_items {
  __typename: "Contract";
  address: string | null;
  blockNumber: any | null;
  tx: contractsCreatedBy_contractsCreatedBy_items_tx | null;
}

export interface contractsCreatedBy_contractsCreatedBy {
  __typename: "ContractsPage";
  items: (contractsCreatedBy_contractsCreatedBy_items | null)[] | null;
  totalCount: number | null;
}

export interface contractsCreatedBy {
  contractsCreatedBy: contractsCreatedBy_contractsCreatedBy | null;
}

export interface contractsCreatedByVariables {
  hash: string;
  limit?: number | null;
  page?: number | null;
}
