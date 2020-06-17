/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOwnersERC721Balances
// ====================================================

export interface getOwnersERC721Balances_getOwnersERC721Balances_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  contract: string;
}

export interface getOwnersERC721Balances_getOwnersERC721Balances {
  __typename: "ERC721TokenBalance";
  balance: string;
  tokenInfo: getOwnersERC721Balances_getOwnersERC721Balances_tokenInfo;
}

export interface getOwnersERC721Balances {
  /**
   * Returns a list of ERC721 balances
   */
  getOwnersERC721Balances: (getOwnersERC721Balances_getOwnersERC721Balances | null)[];
}

export interface getOwnersERC721BalancesVariables {
  hash: string;
}
