/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TokenExchangeRatePage
// ====================================================

export interface TokenExchangeRatePage_items {
  __typename: "TokenExchangeRate";
  address: string | null;
  currentPrice: any | null;
  image: string | null;
  marketCap: any | null;
  name: string | null;
  priceChangePercentage24h: any | null;
  symbol: string | null;
  totalVolume: any | null;
}

export interface TokenExchangeRatePage {
  __typename: "TokenExchangeRatesPage";
  items: TokenExchangeRatePage_items[];
  hasMore: boolean;
}
