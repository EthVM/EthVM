/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TokenExchangeRateFilter } from "./globalTypes";

// ====================================================
// GraphQL query operation: tokenExchangeRates
// ====================================================

export interface tokenExchangeRates_tokenExchangeRatePage_items {
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

export interface tokenExchangeRates_tokenExchangeRatePage {
  __typename: "TokenExchangeRatesPage";
  items: tokenExchangeRates_tokenExchangeRatePage_items[];
  totalCount: number;
}

export interface tokenExchangeRates {
  tokenExchangeRatePage: tokenExchangeRates_tokenExchangeRatePage;
}

export interface tokenExchangeRatesVariables {
  sort: TokenExchangeRateFilter;
  offset?: number | null;
  limit?: number | null;
}
