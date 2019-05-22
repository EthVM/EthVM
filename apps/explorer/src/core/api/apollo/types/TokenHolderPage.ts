/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TokenHolderPage
// ====================================================

export interface TokenHolderPage_items {
  __typename: "TokenHolder";
  address: string;
  balance: any;
}

export interface TokenHolderPage {
  __typename: "TokenHoldersPage";
  items: TokenHolderPage_items[];
  totalCount: number;
}
