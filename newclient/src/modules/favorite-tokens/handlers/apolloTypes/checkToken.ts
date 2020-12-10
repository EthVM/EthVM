/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: checkToken
// ====================================================

export interface checkToken_checkToken {
  __typename: "FavToken";
  symbol: string;
  address: string;
}

export interface checkToken {
  checkToken: checkToken_checkToken | null;
}

export interface checkTokenVariables {
  address: string;
}
