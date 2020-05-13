/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenHolders
// ====================================================

export interface tokenHolders_tokenHolders_items {
  __typename: "TokenHolder";
  address: string;
  balance: any;
}

export interface tokenHolders_tokenHolders {
  __typename: "TokenHoldersPage";
  items: tokenHolders_tokenHolders_items[];
  hasMore: boolean;
}

export interface tokenHolders {
  tokenHolders: tokenHolders_tokenHolders;
}

export interface tokenHoldersVariables {
  address: string;
  limit?: number | null;
  offset?: number | null;
}
