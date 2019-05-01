/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: contractsCreatedBy
// ====================================================

export interface contractsCreatedBy_contractsCreatedBy_metadata {
  __typename: "ContractMetadata";
  name: string | null;
  symbol: string | null;
  website: string | null;
}

export interface contractsCreatedBy_contractsCreatedBy {
  __typename: "Contract";
  address: string | null;
  totalSupply: any | null;
  metadata: contractsCreatedBy_contractsCreatedBy_metadata | null;
}

export interface contractsCreatedBy {
  contractsCreatedBy: (contractsCreatedBy_contractsCreatedBy | null)[] | null;
}

export interface contractsCreatedByVariables {
  hash: string;
  limit?: number | null;
  page?: number | null;
}
