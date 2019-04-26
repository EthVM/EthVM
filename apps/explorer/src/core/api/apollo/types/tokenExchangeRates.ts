/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TokenExchangeRateFilter } from "./globalTypes";

// ====================================================
// GraphQL query operation: tokenExchangeRates
// ====================================================

export interface tokenExchangeRates_tokenExchangeRates {
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

export interface tokenExchangeRates {
  tokenExchangeRates: (tokenExchangeRates_tokenExchangeRates | null)[];
}

export interface tokenExchangeRatesVariables {
  filter: TokenExchangeRateFilter;
  limit?: number | null;
  page?: number | null;
}
