/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ExchangeFrom, ExchangeTo } from "./globalTypes";

// ====================================================
// GraphQL query operation: quote
// ====================================================

export interface quote_quote {
  __typename: "Quote";
  to: string | null;
  price: any | null;
  last_update: any | null;
  vol_24h: string | null;
}

export interface quote {
  quote: quote_quote | null;
}

export interface quoteVariables {
  symbol: ExchangeFrom;
  to: ExchangeTo;
}
