/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenHolders
// ====================================================

export interface tokenHolders_tokenHolders_items {
  __typename: "TokenHolder";
  address: string | null;
  balance: any | null;
}

export interface tokenHolders_tokenHolders {
  __typename: "TokenHoldersPage";
  items: (tokenHolders_tokenHolders_items | null)[] | null;
  totalCount: number | null;
}

export interface tokenHolders {
  tokenHolders: tokenHolders_tokenHolders | null;
}

export interface tokenHoldersVariables {
  address: string;
  limit?: number | null;
  page?: number | null;
}
