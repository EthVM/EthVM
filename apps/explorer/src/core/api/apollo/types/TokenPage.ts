/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TokenPage
// ====================================================

export interface TokenPage_items {
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

export interface TokenPage {
  __typename: "TokenPage";
  items: TokenPage_items[];
  totalCount: number;
}
