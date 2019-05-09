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
  balance: any | null;
  currentPrice: any | null;
}

export interface addressAllTokensOwned {
  addressAllTokensOwned: addressAllTokensOwned_addressAllTokensOwned[];
}

export interface addressAllTokensOwnedVariables {
  address: string;
}
