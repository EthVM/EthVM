/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ExchangeRatePair } from "./globalTypes";

// ====================================================
// GraphQL query operation: coinExchangeRate
// ====================================================

export interface coinExchangeRate_coinExchangeRate {
  __typename: "CoinExchangeRate";
  currency: string | null;
  price: any | null;
  marketCap: any | null;
  vol24h: any | null;
  change24h: any | null;
  lastUpdated: any | null;
}

export interface coinExchangeRate {
  coinExchangeRate: coinExchangeRate_coinExchangeRate | null;
}

export interface coinExchangeRateVariables {
  pair: ExchangeRatePair;
}
