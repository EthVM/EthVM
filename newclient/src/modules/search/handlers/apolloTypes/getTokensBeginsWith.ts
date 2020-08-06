/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTokensBeginsWith
// ====================================================

export interface getTokensBeginsWith_getTokensBeginsWith {
  __typename: "TokenSearch";
  contract: string;
  keyword: string;
}

export interface getTokensBeginsWith {
  getTokensBeginsWith: (getTokensBeginsWith_getTokensBeginsWith | null)[];
}

export interface getTokensBeginsWithVariables {
  keyword: string;
}
