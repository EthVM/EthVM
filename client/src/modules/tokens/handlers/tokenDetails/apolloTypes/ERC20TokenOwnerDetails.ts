/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ERC20TokenOwnerDetails
// ====================================================

export interface ERC20TokenOwnerDetails_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface ERC20TokenOwnerDetails {
  __typename: "ERC20TokenBalance";
  tokenInfo: ERC20TokenOwnerDetails_tokenInfo;
  owner: string;
  balance: string;
}
