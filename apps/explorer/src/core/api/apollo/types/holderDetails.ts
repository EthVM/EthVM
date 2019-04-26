/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: holderDetails
// ====================================================

export interface holderDetails_tokenHolder {
  __typename: "TokenHolder";
  address: string | null;
  balance: string | null;
}

export interface holderDetails {
  tokenHolder: holderDetails_tokenHolder | null;
}

export interface holderDetailsVariables {
  address: string;
  holderAddress: string;
}
