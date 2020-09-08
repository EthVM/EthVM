/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC20TokenOwners
// ====================================================

export interface getERC20TokenOwners_getERC20TokenOwners_owners_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface getERC20TokenOwners_getERC20TokenOwners_owners {
  __typename: "ERC20TokenBalance";
  tokenInfo: getERC20TokenOwners_getERC20TokenOwners_owners_tokenInfo;
  owner: string;
  balance: string;
}

export interface getERC20TokenOwners_getERC20TokenOwners {
  __typename: "ERC20TokenOwners";
  owners: (getERC20TokenOwners_getERC20TokenOwners_owners | null)[];
  nextKey: string | null;
}

export interface getERC20TokenOwners {
  /**
   * Returns a list of all addresses that own an ERC20Token
   */
  getERC20TokenOwners: getERC20TokenOwners_getERC20TokenOwners;
}

export interface getERC20TokenOwnersVariables {
  contract: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
