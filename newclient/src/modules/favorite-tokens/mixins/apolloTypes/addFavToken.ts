/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addFavToken
// ====================================================

export interface addFavToken_addFavToken {
  __typename: "FavToken";
  symbol: string;
}

export interface addFavToken {
  addFavToken: addFavToken_addFavToken;
}

export interface addFavTokenVariables {
  address: string;
  symbol?: string | null;
}
