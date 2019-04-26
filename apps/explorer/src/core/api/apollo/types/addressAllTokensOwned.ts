/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: addressAllTokensOwned
// ====================================================

export interface addressAllTokensOwned_addressAllTokensOwned {
  __typename: "Token";
  name: string | null;
  symbol: string | null;
  address: string | null;
  decimals: number | null;
  balance: string | null;
  currentPrice: string | null;
}

export interface addressAllTokensOwned {
  addressAllTokensOwned: (addressAllTokensOwned_addressAllTokensOwned | null)[];
}

export interface addressAllTokensOwnedVariables {
  address: string;
}
