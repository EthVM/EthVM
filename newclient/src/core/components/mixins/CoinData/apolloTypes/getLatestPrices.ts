/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLatestPrices
// ====================================================

export interface getLatestPrices_getLatestPrices {
  __typename: "TokenMarketInfo";
  id: string;
  symbol: string;
  name: string;
  image: string;
  contract: string | null;
  current_price: number | null;
  market_cap: number | null;
  total_volume: number | null;
  price_change_24h: number | null;
  total_supply: string | null;
}

export interface getLatestPrices {
  getLatestPrices: (getLatestPrices_getLatestPrices | null)[];
}
