/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenHolders
// ====================================================

export interface tokenHolders_tokenHolders {
  __typename: "TokenHolder";
  address: string | null;
  balance: string | null;
}

export interface tokenHolders {
  tokenHolders: (tokenHolders_tokenHolders | null)[] | null;
}

export interface tokenHoldersVariables {
  address: string;
  limit?: number | null;
  page?: number | null;
}
