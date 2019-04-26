/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenExchangeRateBySymbol
// ====================================================

export interface tokenExchangeRateBySymbol_tokenExchangeRateBySymbol {
  __typename: "TokenExchangeRate";
  address: string | null;
  circulatingSupply: string | null;
  currentPrice: any | null;
  high24h: any | null;
  image: string | null;
  lastUpdated: string | null;
  low24h: any | null;
  marketCap: any | null;
  marketCapChange24h: any | null;
  marketCapChangePercentage24h: any | null;
  marketCapRank: number | null;
  name: string | null;
  priceChange24h: any | null;
  priceChangePercentage24h: any | null;
  symbol: string | null;
  totalSupply: string | null;
  totalVolume: any | null;
}

export interface tokenExchangeRateBySymbol {
  tokenExchangeRateBySymbol: tokenExchangeRateBySymbol_tokenExchangeRateBySymbol | null;
}

export interface tokenExchangeRateBySymbolVariables {
  symbol: string;
}
