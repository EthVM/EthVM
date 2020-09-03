/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ERC20TokenOwners
// ====================================================

export interface ERC20TokenOwners_owners_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface ERC20TokenOwners_owners {
  __typename: "ERC20TokenBalance";
  tokenInfo: ERC20TokenOwners_owners_tokenInfo;
  owner: string;
  balance: string;
}

export interface ERC20TokenOwners {
  __typename: "ERC20TokenOwners";
  owners: (ERC20TokenOwners_owners | null)[];
  nextKey: string | null;
}
