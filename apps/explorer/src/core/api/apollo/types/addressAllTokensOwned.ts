/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: addressAllTokensOwned
// ====================================================

export interface addressAllTokensOwned_tokens_items {
  __typename: "Token";
  name: string | null;
  symbol: string | null;
  address: string | null;
  decimals: number | null;
  balance: any | null;
  currentPrice: any | null;
  priceChange24h: any | null;
  image: string | null;
}

export interface addressAllTokensOwned_tokens {
  __typename: "TokenPage";
  items: addressAllTokensOwned_tokens_items[];
  totalCount: number;
}

export interface addressAllTokensOwned {
  tokens: addressAllTokensOwned_tokens;
}

export interface addressAllTokensOwnedVariables {
  address: string;
  offset?: number | null;
  limit?: number | null;
}
