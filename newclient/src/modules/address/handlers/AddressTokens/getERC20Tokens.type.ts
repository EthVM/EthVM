/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC20Tokens
// ====================================================

export interface getERC20Tokens_getOwnersERC20Tokens_owners_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  contract: string;
}

export interface getERC20Tokens_getOwnersERC20Tokens_owners {
  __typename: "ERC20TokenBalance";
  tokenInfo: getERC20Tokens_getOwnersERC20Tokens_owners_tokenInfo;
  balance: string;
}

export interface getERC20Tokens_getOwnersERC20Tokens {
  __typename: "ERC20TokenOwners";
  owners: (getERC20Tokens_getOwnersERC20Tokens_owners | null)[];
  nextKey: string | null;
}

export interface getERC20Tokens {
  /**
   * Returns a list of all ERC20Tokens owned by an address
   */
  getOwnersERC20Tokens: getERC20Tokens_getOwnersERC20Tokens;
}

export interface getERC20TokensVariables {
  hash: string;
  _nextKey?: string | null;
}
