/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenExchangeRateByAddress
// ====================================================

export interface tokenExchangeRateByAddress_tokenExchangeRateByAddress {
  __typename: "TokenExchangeRate";
  address: string | null;
  circulatingSupply: string | null;
  currentPrice: any | null;
  image: string | null;
  marketCap: any | null;
  name: string | null;
  priceChangePercentage24h: any | null;
  symbol: string | null;
  totalSupply: string | null;
  totalVolume: any | null;
  owner: string | null;
  holdersCount: number | null;
}

export interface tokenExchangeRateByAddress {
  tokenExchangeRateByAddress: tokenExchangeRateByAddress_tokenExchangeRateByAddress | null;
}

export interface tokenExchangeRateByAddressVariables {
  address: string;
}
