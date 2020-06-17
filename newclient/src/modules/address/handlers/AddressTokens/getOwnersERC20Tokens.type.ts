/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOwnersERC20Tokens
// ====================================================

export interface getOwnersERC20Tokens_getOwnersERC20Tokens_owners_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  contract: string;
}

export interface getOwnersERC20Tokens_getOwnersERC20Tokens_owners {
  __typename: "ERC20TokenBalance";
  tokenInfo: getOwnersERC20Tokens_getOwnersERC20Tokens_owners_tokenInfo;
  balance: string;
}

export interface getOwnersERC20Tokens_getOwnersERC20Tokens {
  __typename: "ERC20TokenOwners";
  owners: (getOwnersERC20Tokens_getOwnersERC20Tokens_owners | null)[];
  nextKey: string | null;
}

export interface getOwnersERC20Tokens {
  /**
   * Returns a list of all ERC20Tokens owned by an address
   */
  getOwnersERC20Tokens: getOwnersERC20Tokens_getOwnersERC20Tokens;
}

export interface getOwnersERC20TokensVariables {
  hash: string;
  _nextKey?: string | null;
}
