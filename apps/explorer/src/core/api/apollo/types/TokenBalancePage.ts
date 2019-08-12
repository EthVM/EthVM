/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TokenBalancePage
// ====================================================

export interface TokenBalancePage_items {
  __typename: "TokenBalance";
  name: string | null;
  symbol: string | null;
  address: string | null;
  decimals: number | null;
  balance: any | null;
  currentPrice: any | null;
  priceChangePercentage24h: any | null;
  image: string | null;
}

export interface TokenBalancePage {
  __typename: "TokenBalancePage";
  items: TokenBalancePage_items[];
  hasMore: boolean;
}
